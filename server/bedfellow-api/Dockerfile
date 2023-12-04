FROM rust:1.74

WORKDIR /bedfellow-api
COPY . .

ENV SPOTIFY_CLIENT_ID ""
ENV SPOTIFY_CLIENT_SECRET ""
ENV SPOTIFY_CLIENT_CALLBACK_IOS org.danondso.bedfellow://callback/
ENV SPOTIFY_CLIENT_CALLBACK_ANDROID com.bedfellow://callback/
ENV RUST_LOG DEBUG

RUN cargo install --path . --list
RUN cargo build --release

ENTRYPOINT ["./target/release/bedfellow-api"]

EXPOSE 8080
