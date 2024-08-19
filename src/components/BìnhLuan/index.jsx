import React, { useState, useEffect } from 'react';
import { FaUserTie, FaEdit } from "react-icons/fa";
import { MdDashboard, MdDelete, MdCategory } from "react-icons/md";
import { FaBookReader, FaShoppingCart, FaAlignJustify, FaBimobject, FaCreditCard, FaCommentAlt } from "react-icons/fa";
import { IoLogOut, IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import styles from './binhluan.module.scss';
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";

const BinhLuan = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [newComment, setNewComment] = useState({
    id_baiviet: '',
    id_nguoidung: '',
    noidung: '',
    thoigiantao: '',
    hienthi: true
  });
  const commentsPerPage = 10;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8181/api/binhluan/`); 
      const result = await response.json();
      if (result.success) {
        setComments(result.data);
      } else {
        console.error('Lỗi hiện thị bình luận:', result.message);
      }
    } catch (error) {
      console.error('Lỗi hiện thị bình luận::', error);
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentComment(null);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewComment({
      id_baiviet: '',
      id_nguoidung: '',
      noidung: '',
      thoigiantao: '',
      hienthi: true
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    console.log('Thêm bình luận:', newComment);
    // Thêm logic gọi API để thêm bình luận mới tại đây
    setNewComment({
      id_baiviet: '',
      id_nguoidung: '',
      noidung: '',
      thoigiantao: '',
      hienthi: true
    });
    setShowAddModal(false);
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
          <li >
            <Link to="/baiviet">
              <i className={styles.bx}><FaCreditCard /></i>
              <span className={styles.text}>Bài viết</span>
            </Link>
          </li>
          <li className={styles.active}>
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
              <input type="search" placeholder="Tìm kiếm..." />
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
                <h3>Bình Luận</h3>
                <i className={styles.bx}></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Stt</th>
                    <th>Tiêu Đề</th>
                    <th>Người Dùng</th>
                    <th>Nội Dung</th>
                    <th>Hiển Thị</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody id="comment-table-body">
                {currentComments.map((comment, index) => (
                    <tr key={comment._id}>
                      <td>{indexOfFirstComment + index + 1}</td>
                      <td>{comment?.id_baiviet?.tieude}</td> 
                      <td>{comment?.id_nguoidung?.ten}</td>
                      <td className={styles.noidung}> {comment.noidung} </td>
                      <td>{comment.hienthi ? 'True' : 'False'}</td>
                      <td>
                        <button className={styles.details} ><FaEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Quay lại</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Tiếp Theo</button>
              </div>
            </div>
          </div>
        </main>
      </section>

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalcontent}>
            <span className={styles.close} onClick={handleCloseAddModal}>&times;</span>
            <h2>Thêm Bình Luận</h2>
            <form onSubmit={handleAddComment}>
              <label>Id Bài Viết</label>
              <input type="text" name="id_baiviet" value={newComment.id_baiviet} onChange={handleChange} required />

              <label>Id Người Dùng</label>
              <input type="text" name="id_nguoidung" value={newComment.id_nguoidung} onChange={handleChange} required />

              <label>Nội Dung</label>
              <textarea name="noidung" value={newComment.noidung} onChange={handleChange} required></textarea>

              <label>Thời Gian Tạo</label>
              <input type="datetime-local" name="thoigiantao" value={newComment.thoigiantao} onChange={handleChange} required />

              <label>Hiển Thị</label>
              <select name="hienthi" value={newComment.hienthi} onChange={handleChange} required>
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>

              <button type="submit">Thêm</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BinhLuan;
