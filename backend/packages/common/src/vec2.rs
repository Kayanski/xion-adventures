use cosmwasm_schema::cw_serde;
use std::ops::{Add, AddAssign, Sub};

#[cw_serde]
pub struct Vec2 {
    pub x: i64,
    pub y: i64,
}

impl std::fmt::Display for Vec2 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl Vec2 {
    pub fn new(x: i64, y: i64) -> Self {
        Vec2 { x, y }
    }

    pub fn is_unit_movement(&self) -> bool {
        self.x.abs() <= 1 && self.y.abs() <= 1
    }
}

impl Add<Vec2> for Vec2 {
    type Output = Vec2;

    fn add(mut self, rhs: Vec2) -> Self::Output {
        self.add_assign(rhs);
        self
    }
}

impl AddAssign<Vec2> for Vec2 {
    fn add_assign(&mut self, rhs: Vec2) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

impl Sub<Vec2> for Vec2 {
    type Output = Vec2;

    fn sub(self, rhs: Vec2) -> Self::Output {
        Self {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
        }
    }
}
