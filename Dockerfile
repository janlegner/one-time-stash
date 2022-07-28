FROM rust:latest as builder
RUN apt update && apt install -y pkg-config libssl-dev libudev-dev
WORKDIR /usr/local
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/stash /usr/local/bin/stash
COPY static /usr/local/static/
CMD ["stash"]
