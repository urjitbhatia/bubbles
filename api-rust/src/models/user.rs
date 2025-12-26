//! User models

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// User profile response model
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserProfile {
    /// User ID
    pub id: String,
    /// Email address
    pub email: String,
    /// Full name
    pub full_name: Option<String>,
    /// Creation timestamp
    pub created_at: String,
}

/// Database model for user profiles
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfileDb {
    pub id: String,
    pub email: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<UserProfileDb> for UserProfile {
    fn from(db: UserProfileDb) -> Self {
        UserProfile {
            id: db.id,
            email: db.email,
            full_name: db.full_name,
            created_at: db.created_at,
        }
    }
}
