import React from "react";

//For Landing Page
import Hero from "@components/LandingPage/Hero";
import Features from "@components/LandingPage/Features";
import Work from "@components/LandingPage/Work";
import Banner from "@components/LandingPage/Banner";
import Footer from "@components/LandingPage/Footer";

//For HomeScreen
import Home from "@components/Home";
import Sider from "@components/Home/Sider";
import Header from "@components/Home/Header";
import Action from "@components/Home/Action";
import Games from "@components/Home/Games";
import CoverImg from "@components/Home/CoverImg";
import ProfileEdit from "@components/Home/ProfileEdit";
import DashboardView from "@components/Home/DashboardView";

//For MatchDetails
import GameDetails from "@components/Matches/GameDetails";

//UI Components
import PageLoading from "@components/UI/PageLoading";
import HeaderLogo from "@components/UI/HeaderLogo";

const MenuCtx = React.createContext();

export {
  Hero,
  Features,
  Work,
  Banner,
  Footer,
  Home,
  PageLoading,
  Sider,
  Header,
  Action,
  Games,
  CoverImg,
  HeaderLogo,
  ProfileEdit,
  GameDetails,
  DashboardView,
  MenuCtx,
};
