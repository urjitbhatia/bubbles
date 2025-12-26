//! Cloudflare Workers API in Rust
//!
//! This is the main entry point for the Rust-based backend.
//! It provides the same API as the Python version but with better performance.

mod models;
mod routes;
mod supabase;
mod auth;
mod error;

use worker::*;
use utoipa::OpenApi;

/// API Documentation
#[derive(OpenApi)]
#[openapi(
    info(
        title = "Supaflare API",
        version = "1.0.0",
        description = "Supaflare API (Rust)"
    ),
    paths(
        routes::health::health_check,
        routes::items::list_items,
        routes::items::get_item,
        routes::items::create_item,
        routes::items::update_item,
        routes::items::delete_item,
        routes::user::get_profile,
    ),
    components(schemas(
        models::item::Item,
        models::item::ItemCreate,
        models::item::ItemList,
        models::user::UserProfile,
        routes::health::HealthResponse,
    )),
    tags(
        (name = "Health", description = "Health check endpoints"),
        (name = "Items", description = "Item CRUD operations"),
        (name = "User", description = "User profile operations"),
    )
)]
pub struct ApiDoc;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}] \"{}\"",
        Date::now().to_string(),
        req.method().to_string(),
        req.path(),
    );
}

fn cors_headers() -> Headers {
    let mut headers = Headers::new();
    headers.set("Access-Control-Allow-Origin", "*").unwrap();
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS").unwrap();
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization").unwrap();
    headers.set("Access-Control-Max-Age", "86400").unwrap();
    headers
}

fn add_cors(mut response: Response) -> Response {
    let headers = response.headers_mut();
    headers.set("Access-Control-Allow-Origin", "*").unwrap();
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS").unwrap();
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization").unwrap();
    response
}

#[event(fetch)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    console_error_panic_hook::set_once();
    log_request(&req);

    // Handle CORS preflight
    if req.method() == Method::Options {
        return Response::empty()
            .map(|r| r.with_headers(cors_headers()));
    }

    let router = Router::new();

    let response = router
        // Health check
        .get_async("/api/v1/health", routes::health::health_check)

        // OpenAPI documentation
        .get("/openapi.json", |_, _| {
            let doc = ApiDoc::openapi().to_pretty_json().unwrap();
            Response::from_json(&serde_json::from_str::<serde_json::Value>(&doc).unwrap())
        })

        // Items CRUD
        .get_async("/api/v1/items", routes::items::list_items)
        .get_async("/api/v1/items/:item_id", routes::items::get_item)
        .post_async("/api/v1/items", routes::items::create_item)
        .patch_async("/api/v1/items/:item_id", routes::items::update_item)
        .delete_async("/api/v1/items/:item_id", routes::items::delete_item)

        // User profile
        .get_async("/api/v1/user/profile", routes::user::get_profile)

        .run(req, env)
        .await?;

    Ok(add_cors(response))
}
