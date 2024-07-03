# Build the rust app
FROM rust:1.74 as build

WORKDIR /bedfellow-api
COPY . .

RUN cargo install --path . --list
RUN cargo build --release

# Create a very smol image with only the rust binary
FROM gcr.io/distroless/cc-debian12
COPY --from=build /bedfellow-api/target/release/bedfellow-api /

ENV SPOTIFY_CLIENT_ID ""
ENV SPOTIFY_CLIENT_SECRET ""
ENV SPOTIFY_CLIENT_CALLBACK_IOS org.danondso.bedfellow://callback/
ENV SPOTIFY_CLIENT_CALLBACK_ANDROID com.bedfellow://callback/
ENV BEDFELLOW_DB_API_BASE_URL "mysql://xxxxx:xxxxx@localhost/bedfellow"
ENV RUST_LOG INFO
ENV HOST_IP "0.0.0.0"

CMD ["./bedfellow-api"]

EXPOSE 8085
