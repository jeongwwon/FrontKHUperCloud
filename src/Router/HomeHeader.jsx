import React from "react";
import { Box, Button, Typography, Toolbar, AppBar } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import { Link } from "react-router-dom";

export default function HomeHeader() {
  return (
    <AppBar
      position="static"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bgcolor: "white",
        "& a": {
          textDecoration: "none",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <Link to="/" sx={{ textDecoration: "none", color: "black" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "2rem",
                textDecoration: "none",
              }}
            >
              <CloudIcon
                sx={{ fontSize: "5rem", marginRight: "0.5rem", fill: "black" }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{ display: "flex", alignItems: "center", color: "black" }}
              >
                KHUperCLOUD
              </Typography>
            </div>
          </Link>
          <Link
            to="/Intro"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              color: "black",
            }}
          >
            기능 소개
          </Link>
          <Link
            to="/Main"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              color: "blue",
              marginLeft:700,
              marginRight:30
            }}
          >
            KHUperCLOUD 바로가기
          </Link>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button sx={{ color: "black", fontSize: 15 }}>로그인</Button>
            <Button sx={{ color: "black", marginLeft: "1rem", fontSize: 15 }}>
              회원가입
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}