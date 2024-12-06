use std::ops::{Add, AddAssign};

use cosmwasm_schema::cw_serde;

use crate::vec2::Vec2;

#[cw_serde]
pub enum PlayerLocation {
    City(Vec2),
    GeneralMap(Vec2),
}

// The Player spawns in the middle of their city
impl Default for PlayerLocation {
    fn default() -> Self {
        Self::city(0, 0)
    }
}

impl std::fmt::Display for PlayerLocation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PlayerLocation::City(vec2) => {
                write!(f, "City{}", vec2)
            }
            PlayerLocation::GeneralMap(vec2) => write!(f, "GeneralMap{}", vec2),
        }
    }
}

impl PlayerLocation {
    pub fn city(x: i64, y: i64) -> Self {
        Self::City(Vec2::new(x, y))
    }
    pub fn general_map(x: i64, y: i64) -> Self {
        Self::GeneralMap(Vec2::new(x, y))
    }
}

impl AddAssign<Vec2> for PlayerLocation {
    fn add_assign(&mut self, rhs: Vec2) {
        match self {
            PlayerLocation::City(vec2) => {
                (*vec2) += rhs;
            }
            PlayerLocation::GeneralMap(vec2) => {
                (*vec2) += rhs;
            }
        }
    }
}

impl Add<Vec2> for PlayerLocation {
    type Output = PlayerLocation;

    fn add(mut self, rhs: Vec2) -> Self::Output {
        self.add_assign(rhs);
        self
    }
}

impl PlayerLocation {
    pub fn move_x(&self, rhs: &Vec2) -> Self {
        match self {
            PlayerLocation::City(vec2) => Self::city(vec2.x + rhs.x, vec2.y),
            PlayerLocation::GeneralMap(vec2) => Self::general_map(vec2.x + rhs.x, vec2.y),
        }
    }
    pub fn move_y(&self, rhs: &Vec2) -> Self {
        match self {
            PlayerLocation::City(vec2) => Self::city(vec2.x, vec2.y + rhs.y),
            PlayerLocation::GeneralMap(vec2) => Self::general_map(vec2.x, vec2.y + rhs.y),
        }
    }
}
