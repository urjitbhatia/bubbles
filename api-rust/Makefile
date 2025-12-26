.PHONY: dev build deploy test lint clean

# Development with Cloudflare Workers runtime (port 9990)
dev:
	wrangler dev

# Build release binary
build:
	cargo install -q worker-build
	worker-build --release

# Deploy to Cloudflare Workers
deploy: build
	wrangler deploy

# Run tests
test:
	cargo test

# Lint code
lint:
	cargo clippy -- -D warnings
	cargo fmt --check

# Format code
format:
	cargo fmt

# Clean build artifacts
clean:
	cargo clean
	rm -rf build/

# Check binary size
size: build
	ls -lh build/worker/*.wasm

# Optimize WASM (already done by worker-build, but manual if needed)
optimize: build
	wasm-opt -Os build/worker/*.wasm -o build/worker/optimized.wasm
	ls -lh build/worker/optimized.wasm
