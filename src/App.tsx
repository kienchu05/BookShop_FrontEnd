import React, { useState } from "react";
import Navbar from "./Layouts/Components/Navbar";
import Footer from "./Layouts/Components/Footer";
import Banner from "./Layouts/Components/Banner";
import List from "./Layouts/Components/Product/List";
import BookCarouselUI from "./BookCarousel/BookCarouselUI";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./Layouts/Components/Abouts/About";
import BookDetail from "./Layouts/Components/Product/Components/BookDetail";
import RatingBook from "./Layouts/Components/Product/Components/RatingBook";
import Register from "./Layouts/Components/Users/Register";
import ActivateAccount from "./Layouts/Components/Users/ActivateAccount";
import Login from "./Layouts/Components/Users/Login";
import UpdateBook from "./Admin/UpdateBook";
import BookManagement from "./Admin/BookMangement";
import AddBook from "./Admin/AddBook";
import UserManagement from "./Admin/UserManagement";
import UserProfile from "./Layouts/Components/Users/UserProfile";

function App() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");

  // Giờ thì maTheLoaiNumber đã là số nguyên (0 hoặc ID thật)
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          search={search}
          setSearch={setSearch}
          searchType={searchType}
          setSearchType={setSearchType}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <BookCarouselUI />
                <List search={search} searchType={searchType} />
              </>
            }
          />
          <Route
            path="/category/:id"
            element={<List search={search} searchType={searchType} />}
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/book/:id"
            element={
              <>
                <BookDetail />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/activate" element={<ActivateAccount />} />
          <Route path="/login" element={<Login />} />
          {/* Các trang dành cho Admin */}

          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/add-book" element={<AddBook />} />
          <Route path="/admin/update-book/:id" element={<UpdateBook />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
