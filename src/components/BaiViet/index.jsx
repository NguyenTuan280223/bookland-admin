import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaBookReader, FaShoppingCart, FaAlignJustify, FaEdit } from "react-icons/fa";
import { MdDashboard, MdDelete } from "react-icons/md";
import { IoLogOut, IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdCategory } from "react-icons/md";
import { FaBimobject } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";

import styles from './baiviet.module.scss';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [newArticle, setNewArticle] = useState({
    tieude: '',
    img: '',
    noidung: '',
    ngaycapnhat: '',
    ngaytao: '',
    mota: '',
    luotxem: '',
    trangthai: false,
    nguoidung: ''
  });
  
  const articlesPerPage = 10;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8181/api/baiviet/');
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài viết:', error);
    }
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleShowMore = (article) => {
    setCurrentArticle(article);
    setNewArticle(article); // Set current article data to newArticle
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentArticle(null);
  };

  const deleteArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:8181/api/baiviet/${id}`, {
        method: 'DELETE',
      });
      
      // Check if the response is okay (status 200)
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Xóa bài viết thất bại'}`);
        return;
      }
  
      // Assuming your backend returns a success message or status
      const data = await response.json();
      
      if (data.status === 1) {
        // Update articles state to remove the deleted article
        setArticles(articles.filter(article => article._id !== id));
        alert('Xóa bài viết thành công');
      } else {
        alert('Xóa bài viết thất bại');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Xóa bài viết thất bại');
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewArticle(prevArticle => ({
            ...prevArticle,
            img: reader.result // Đường dẫn hình ảnh đã chuyển đổi
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNewArticle(prevArticle => ({
        ...prevArticle,
        [name]: value
      }));
    }
  };
  

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8181/api/baiviet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });
      const data = await response.json();
      if (data.success) {
        alert('Thêm bài viết thành công');
        setArticles([...articles, data.data]); 
        setShowModalAdd(false); 
        setNewArticle({ 
          tieude: '',
          img: '',
          noidung: '',
          ngaycapnhat: '',
          ngaytao: '',
          mota: '',
          luotxem: '',
          trangthai: false,
          nguoidung: ''
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Thêm bài viết thất bại');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Chức năng cập nhật bài viết chưa được triển khai');
  };

  const shortenUrl = (url) => {
    return url.length > 60 ? `${url.substring(0, 60)}...` : url;
  };
  const shortenId = (url) => {
    return url.length > 10 ? `${url.substring(0, 10)}...` : url;
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
          <li>
            <Link to="/tacgia">
              <i className={styles.bx}><PiUserListFill />
              </i>
              <span className={styles.text}>Tác giả</span>
            </Link>
          </li>
          <li>
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
          <li className={styles.active}>
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
                <h3>Bài Viết</h3>
                <div className={styles.bgadd}>
                  <a href="#" className={styles.add} onClick={() => setShowModalAdd(true)}>+ Thêm</a>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ảnh</th>
                    <th>Tiêu Đề</th>
                    <th>Nội Dung</th>
                    <th>Hiện thị</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.map(article => (
                    <tr key={article._id}>
                      <td>{shortenId(article._id)}</td>
                      <td><img src={article.img} alt="" style={{ maxWidth: '100px' }} /></td>
                      <td>{article.tieude}</td>
                      <td>{shortenUrl(article.noidung)}</td>
                      <td>{article.trangthai ? 'True' : 'False'}</td>
                      <td>
                        <button className={styles.delete} onClick={() => deleteArticle(article._id)}><MdDelete /></button>
                        <button className={styles.edit} ><FaEdit /></button>
                        <button className={styles.details}><FaEye /></button>
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

      {showModal && currentArticle && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleCloseModal}>&times;</span>
            <h2>Chi tiết Bài Viết</h2>
            <p className={styles.deid}>ID: {currentArticle._id}</p>
            <p>Người Dùng: {currentArticle.nguoidung}</p>
            <p>Ảnh: <img src={currentArticle.img} alt="" style={{ maxWidth: '100px' }} /></p>
            <p>Ngày Cập Nhật: {currentArticle.ngaycapnhat}</p>
            <p>Ngày Tạo: {currentArticle.ngaytao}</p>
            <p>Mô Tả: {currentArticle.mota}</p>
            <p>Lượt Xem: {currentArticle.luotxem}</p>
            <p>Nội Dung: {currentArticle.noidung}</p>
            <p>Tiêu Đề: {currentArticle.tieude}</p>
            <p>Hiển Thị: {currentArticle.trangthai ? 'True' : 'False'}</p>
          </div>
        </div>
      )}

{showModalAdd && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={() => setShowModalAdd(false)}>&times;</span>
      <h2>Thêm Bài Viết Mới</h2>
      <form onSubmit={handleAddArticle}>
        <div className={`${styles.formGroup} ${styles.row1}`}>
          <div className={styles.inputWrapper}>
            <label htmlFor="tieude">Tiêu Đề</label>
            <input type="text" id="tieude" name="tieude" value={newArticle.tieude} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputWrapper}>
  <label htmlFor="img">Ảnh</label>
  <input type="file" id="img" name="img" accept="image/*" onChange={handleInputChange} required />
</div>

        </div>
        <div className={`${styles.formGroup} ${styles.row2}`}>
          <div className={styles.inputWrapper}>
            <label htmlFor="nguoidung">Người Dùng</label>
            <input type="text" id="nguoidung" name="nguoidung" value={newArticle.nguoidung} onChange={handleInputChange} required />
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.row3}`}>
          <div className={styles.inputWrapper}>
            <label htmlFor="ngaycapnhat">Ngày Cập Nhật</label>
            <input type="date" id="ngaycapnhat" name="ngaycapnhat" value={newArticle.ngaycapnhat} onChange={handleInputChange} />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="ngaytao">Ngày Tạo</label>
            <input type="date" id="ngaytao" name="ngaytao" value={newArticle.ngaytao} onChange={handleInputChange} />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="noidung">Nội Dung</label>
          <textarea id="noidung" name="noidung" value={newArticle.noidung} onChange={handleInputChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mota">Mô Tả</label>
          <textarea id="mota" name="mota" value={newArticle.mota} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="luotxem">Lượt Xem</label>
          <input type="number" id="luotxem" name="luotxem" value={newArticle.luotxem} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="trangthai">Hiển Thị</label>
          <select id="trangthai" name="trangthai" value={newArticle.trangthai ? 'true' : 'false'} onChange={e => setNewArticle(prevArticle => ({ ...prevArticle, trangthai: e.target.value === 'true' }))}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <button type="submit" className={styles.submitBtn}>Thêm </button>
      </form>
    </div>
  </div>
)}


    </>
  );
};

export default Article;
