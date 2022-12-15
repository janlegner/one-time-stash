#![feature(proc_macro_hygiene, decl_macro)]
use rocket::http::Status;
use rocket::request::Form;
use rocket::response::status;
use rocket::State;
use rocket_contrib::serve::StaticFiles;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::thread;
use std::time::{Duration, SystemTime};

pub mod stash_id;

#[macro_use]
extern crate rocket;

#[derive(FromForm, Debug, Clone)]
struct Stash {
    expires_at: u64,
    secret: String,
}

#[derive(Debug)]
struct Context {
    stashes: Arc<RwLock<HashMap<String, Stash>>>,
}

#[post("/create-stash", data = "<stash>")]
fn create_stash(stash: Form<Stash>, context: State<Arc<Context>>) -> status::Custom<String> {
    let stash_id = crate::stash_id::generate(32);

    let mut stashes = context.stashes.write().expect("RwLock poisoned");
    stashes.insert(stash_id.clone(), stash.clone());

    status::Custom(Status::Created, stash_id)
}

#[get("/claim-stash/<stash_id>")]
fn claim_stash(stash_id: String, context: State<Arc<Context>>) -> status::Custom<String> {
    let mut stashes = context.stashes.write().expect("RwLock poisoned");
    if let Some(stash) = stashes.remove(&stash_id) {
        return status::Custom(Status::Ok, stash.secret);
    }

    status::Custom(Status::NotFound, "".to_string())
}

fn main() {
    let context = Arc::new(Context {
        stashes: Arc::new(RwLock::new(HashMap::new())),
    });

    {
        let thread_context = context.clone();
        thread::spawn(move || loop {
            loop {
                thread::sleep(Duration::from_secs(60));
                match SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
                    Ok(now) => {
                        let mut stashes = thread_context.stashes.write().expect("RwLock poisoned");
                        stashes.retain(|_, stash| now.as_secs() < stash.expires_at);
                    }
                    Err(_) => panic!("SystemTime before UNIX EPOCH!"),
                }
            }
        });
    }

    rocket::ignite()
        .manage(context)
        .mount(
            "/",
            StaticFiles::from(concat!(env!("CARGO_MANIFEST_DIR"), "/static")),
        )
        .mount("/api", routes![create_stash, claim_stash])
        .launch();
}
