use rand::{self, Rng};

const CHARACTERS: &[u8] = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

pub fn generate(size: usize) -> String {
    let mut stash_id = String::with_capacity(size);
    let mut rng = rand::thread_rng();
    for _ in 0..size {
        stash_id.push(CHARACTERS[rng.gen::<usize>() % CHARACTERS.len()] as char);
    }

    stash_id
}
