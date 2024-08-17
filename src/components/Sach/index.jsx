import React, { useState, useEffect } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaUser, FaUserTie, FaBookReader, FaShoppingCart, FaEdit } from "react-icons/fa";
import { IoSettings, IoLogOut, IoSearch } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaAlignJustify } from "react-icons/fa";
import { Link } from 'react-router-dom';
import styles from './sach.module.scss';
import { MdCategory } from "react-icons/md";
import { FaBimobject } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
// Dữ liệu mẫu về sách
const initialBookState = {
  tacgia: '',
  nxb: '',
  img: '',
  mota: '',
  ngayxuatban: '',
  ngaytao: '',
  ten: '',
  luotxem: 0,
  gia: 0,
  giacu: 0,
  luotban: 0,
  ngonngu: '',
  hien_thi: true,
  theloaisach: ''
};

const Sach = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState(initialBookState);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);


  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8181/api/sach/`);
        const data = await response.json();
        if (data.success) {
          const fetchedBooks = data.data;
          setBooks(fetchedBooks);
          setTotalPages(Math.ceil(fetchedBooks.length / booksPerPage));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:8181/api/theloai/`);
        const data = await response.json();
        if (data.success) {
          const fetchedCategories = data.data;
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
      }
    };

    fetchCategories();
  }, []);

  // Logic để lấy sách hiện tại trên trang
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };


  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentBook(null);
  };

  const handleDetailsClick = (book) => {
    setCurrentBook(book);
    setShowDetailsModal(true);
  };
  const handleShowMore = (book) => {
    console.log('Show more:', book);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewBook(initialBookState);
  };

  const handleAddBookClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewBook(prevState => ({
            ...prevState,
            [name]: reader.result // Lưu URL của ảnh vào trạng thái
          }));
        };
        reader.readAsDataURL(file); // Đọc tệp ảnh và tạo URL
      }
    } else {
      setNewBook(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8181/api/sach/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
  
      const data = await response.json();
      if (data.success) {
        // Thêm sách vào danh sách
        setBooks(prevBooks => [...prevBooks, data.data]);
        // Cập nhật số trang (nếu cần)
        setTotalPages(Math.ceil((books.length + 1) / booksPerPage));
        // Đóng modal và reset trạng thái sách mới
        handleCloseModal();
        alert('Thêm sách thành công');
      } else {
        alert(data.message || 'Thêm sách không thành công');
      }
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };
  
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:8181/api/sach/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 1) {
        // Xóa sách khỏi danh sách trên frontend
        setBooks(books.filter(book => book._id !== id));
        alert('Xóa sách thành công');
      } else {
        alert(data.message || 'Xóa sách không thành công');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleEditBookClick = (book) => {
    setNewBook(book);
    setShowModal(true);
    setIsEditing(true);
  };


  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8181/api/theloai/${newBook.id_sach}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();
      if (data.success) {
        setBooks(prevBooks => prevBooks.map(book => book.id_sach === newBook.id_sach ? newBook : book));
        handleCloseModal();
        alert('Cập nhật sách thành công');
      } else {
        alert(data.message || 'Cập nhật sách không thành công');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <>
         <section className={styles.sidebar}>
        <a href="#" className={styles.brand}>
          <i className={styles.bx}></i>
          <span className={styles.text}>AdminHub</span>
        </a>
        <ul className={`${styles.menu} ${styles.top}`}>
          <li>
            <Link to="/da">
              <i className={styles.bx}><MdDashboard /></i>
              <span className={styles.text}>Dashboard</span>
            </Link>
          </li>
          <li >
            <Link to="/admin">
              <i className={styles.bx}><FaUserTie /></i>
              <span className={styles.text}>Admin</span>
            </Link>
          </li>
          <li >
            <Link to="/nguoidung">
              <i className={styles.bx}><FaUsers />
              </i>
              <span className={styles.text}>Người dùng</span>
            </Link>
          </li>
          <li >
            <Link to="/tacgia">
              <i className={styles.bx}><PiUserListFill />
              </i>
              <span className={styles.text}>Tác giả</span>
            </Link>
          </li>
          <li className={styles.active}>
            <Link to="/sach">
              <i className={styles.bx}><FaBookReader /></i>
              <span className={styles.text}>Sách</span>
            </Link>
          </li>
          <li>
            <Link to="/theloai">
              <i className={styles.bx}><MdCategory /></i>
              <span className={styles.text}>Thể loại</span>
            </Link>
          </li>
          <li>
            <Link to="/donhang">
              <i className={styles.bx}><FaShoppingCart /></i>
              <span className={styles.text}>Đơn hàng</span>
            </Link>
          </li>
       
          <li>
            <Link to="/banner">
              <i className={styles.bx}><FaBimobject /></i>
              <span className={styles.text}>Banner</span>
            </Link>
          </li>
          <li >
            <Link to="/baiviet">
              <i className={styles.bx}><FaCreditCard /></i>
              <span className={styles.text}>Bài viết</span>
            </Link>
          </li>
          <li>
            <Link to="/binhluan">
              <i className={styles.bx}><FaCommentAlt /></i>
              <span className={styles.text}>Bình luận</span>
            </Link>
          </li>
        </ul>
        <ul className={styles.menu}>
       
          <li>
            <a href="#" className={styles.logout}>
              <i className={styles.bx}><IoLogOut /></i>
              <span className={styles.text}>Đăng xuất</span>
            </a>
          </li>
        </ul>
      </section>

      <section className={styles.content}>
        <nav>
          <i className={styles.bx}><FaAlignJustify /></i>
          <form action="#">
            <div className={styles.forminput}>
              <input type="search" placeholder="Search..." />
              <button type="submit" className={styles.searchbtn}><i className={styles.bx}><IoSearch /></i></button>
            </div>
          </form>
          <a href="#" className={styles.profile}>
            <img src="" alt="" />
          </a>
        </nav>
        <main>
          <div className={styles.tabledata}>
            <div className={styles.order}>
              <div className={styles.head}>
                <h3>Sách</h3>
                <div className={styles.bgadd}>
                  <a href="#" className={styles.add} onClick={handleAddBookClick}>+ Thêm</a>
                </div>
                <i className={styles.bx}></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Giá cũ</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody id="book-table-body">
                  {currentBooks.map(book => (
                    <tr key={book._id}>
                      <td className={styles.deid}>{book._id}</td>
                      <td><img src={book.img}  /></td>
                      <td className={styles.tenb}>{book.ten}</td>
                      <td>{book.gia}</td>
                      <td>{book.giacu}</td>
                      <td className={styles.motaa}>{book.mota}</td>
                      <td>{book.hien_thi ? 'True' : 'False'}</td>
                      <td>
                        <button className={styles.delete} onClick={() => handleDeleteBook(book._id)}><MdDelete /></button>
                        <button className={styles.edit} onClick={() => handleEditBookClick(book)}><FaEdit /></button>
                        <button className={styles.details}  onClick={() => handleDetailsClick(book)}><FaEye /></button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Quay lại</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Tiếp theo</button>
              </div>
            </div>
          </div>
        </main>
      </section>

      {showModal && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={handleCloseModal}>&times;</span>
      <h2>{isEditing ? 'Cập Nhật Sách' : 'Thêm Sách'}</h2>
      <form onSubmit={isEditing ? handleUpdateBook : handleAddBook}>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Tên sách:</label>
            <input type="text" name="ten" value={newBook.ten} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputWrapper}>
  <label>Ảnh:</label>
  <input type="file" name="img" onChange={handleInputChange}  />
</div>

        
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Tác giả:</label>
            <input type="text" name="tacgia" value={newBook.tacgia} onChange={handleInputChange} />
          </div>
          <div className={styles.inputWrapper}>
            <label>NXB:</label>
            <input type="text" name="nxb" value={newBook.nxb} onChange={handleInputChange}  />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Mô tả:</label>
            <textarea name="mota" value={newBook.mota} onChange={handleInputChange} required />
          </div>
        </div>

        <div className={styles.formGroup}>
        <div className={styles.inputWrapper}>
            <label>Giá cũ:</label>
            <input type="number" name="giacu" value={newBook.giacu} onChange={handleInputChange} />
          </div>
          <div className={styles.inputWrapper}>
            <label>Giá:</label>
            <input type="number" name="gia" value={newBook.gia} onChange={handleInputChange} required />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Ngày xuất bản:</label>
            <input type="date" name="ngayxuatban" value={newBook.ngayxuatban} onChange={handleInputChange}  />
          </div>
          <div className={styles.inputWrapper}>
            <label>Ngôn ngữ:</label>
            <input type="text" name="ngonngu" value={newBook.ngonngu} onChange={handleInputChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Trạng thái:</label>
            <select name="hien_thi" value={newBook.hien_thi} onChange={handleInputChange}>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <label>Thể loại sách:</label>
            <input type="text" name="theloaisach" value={newBook.theloaisach} onChange={handleInputChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Lượt xem:</label>
            <input type="number" name="luotxem" value={newBook.luotxem} onChange={handleInputChange} />
          </div>
        </div>

        <button type="submit">{isEditing ? 'Cập Nhật Sách' : 'Thêm Sách'}</button>
      </form>
    </div>
  </div>
)}




{showDetailsModal && currentBook && (
  <div className={styles.modall}>
    <div className={styles.modalContentt}>
      <span className={styles.close} onClick={handleCloseDetailsModal}>x</span>
      <h2>Chi Tiết Sách</h2>
      <div>
        <label>Id:</label>
        <p>{currentBook._id}</p>
      </div>
      <div>
        {/* <label>Ảnh:</label> */}
        <img src={currentBook.img} alt="" className={styles.detailImage} style={{ maxWidth: '100px' }}/>
      </div>
      <div>
        <label>Tên:</label>
        <p>{currentBook.ten}</p>
      </div>
      <div>
        <label>Giá:</label>
        <p>{currentBook.gia}</p>
      </div>
      <div>
        <label>Giá cũ:</label>
        <p>{currentBook.giacu}</p>
      </div>
      <div>
        <label>Mô tả:</label>
        <p>{currentBook.mota}</p>
      </div>
      <div>
        <label>Trạng thái:</label>
        <p>{currentBook.hien_thi ? 'True' : 'False'}</p>
      </div>
    </div>
  </div>
)}



    </>
  );
};

export default Sach;
