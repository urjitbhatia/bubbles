//! Item models

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Request model for creating/updating an item
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ItemCreate {
    /// Item name
    pub name: String,
    /// Optional description
    pub description: Option<String>,
}

/// Item response model
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Item {
    /// Unique identifier
    pub id: String,
    /// Item name
    pub name: String,
    /// Optional description
    pub description: Option<String>,
    /// Creation timestamp
    pub created_at: String,
    /// Owner user ID
    pub user_id: String,
}

/// Database model (includes updated_at)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ItemDb {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub user_id: String,
}

impl From<ItemDb> for Item {
    fn from(db: ItemDb) -> Self {
        Item {
            id: db.id,
            name: db.name,
            description: db.description,
            created_at: db.created_at,
            user_id: db.user_id,
        }
    }
}

/// Paginated list of items
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ItemList {
    /// List of items
    pub items: Vec<Item>,
    /// Total count
    pub total: i64,
    /// Current page
    pub page: i32,
    /// Items per page
    pub limit: i32,
}
