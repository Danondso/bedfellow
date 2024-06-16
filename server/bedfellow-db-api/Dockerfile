# Build the rust app
FROM rust:1.79 as build

WORKDIR /bedfellow-db-api
COPY . .

RUN cargo install --path . --list
RUN cargo build --release

# Create a very smol image with only the rust binary
FROM gcr.io/distroless/cc-debian12
COPY --from=build /bedfellow-db-api/target/release/bedfellow-db-api /

ENV DATABASE_URL "mysql://xxxxx:xxxxx@host.docker.internal/bedfellow"
ENV RUST_LOG INFO
ENV HOST_IP "0.0.0.0"

CMD ["./bedfellow-db-api"]

EXPOSE 8000