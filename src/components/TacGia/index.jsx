import React, { useState, useEffect } from 'react';
import { FaUserTie, FaEdit } from "react-icons/fa";
import { MdDashboard, MdDelete } from "react-icons/md";
import { FaBookReader, FaShoppingCart } from "react-icons/fa";
import { IoSettings, IoLogOut, IoSearch } from "react-icons/io5";
import { FaAlignJustify } from "react-icons/fa";
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { MdCategory } from "react-icons/md";
import { FaBimobject } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
const TacGia = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    ten: '',
    img: '',
    tieusu: '',
    id_hienthi: ''
  });
  const authorsPerPage = 10;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('http://localhost:8181/api/tacgia/');
        const data = await response.json();
        if (data.success) {
          setAuthors(data.data);
        } else {
          console.error("Lấy dữ liệu tác giả thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu :", error);
      }
    };

    fetchAuthors();
  }, []);

  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

  const totalPages = Math.ceil(authors.length / authorsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAuthor(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentAuthor(null);
  };

  const handleAddAuthorClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewAuthor(prevState => ({
            ...prevState,
            [name]: reader.result // Lưu URL của ảnh vào trạng thái
          }));
        };
        reader.readAsDataURL(file); // Đọc tệp ảnh và tạo URL
      }
    } else {
      setNewAuthor({ ...newAuthor, [name]: value });
    }
  };
  

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8181/api/tacgia/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAuthor)
      });
      const data = await response.json();
      if (data.status) {
        setAuthors([...authors, newAuthor]);
        handleCloseModal();
      } else {
        console.error("Thêm tác giả thất bại:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm tác giả:", error);
    }
  };
  const handleDeleteAuthor = async (id) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa tác giả này không?');
  
    if (!confirmed) {
      // Nếu người dùng không xác nhận, thoát hàm
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8181/api/tacgia/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        // Nếu phản hồi không thành công, lấy thông tin lỗi
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Xóa tác giả thất bại'}`);
        return;
      }
  
      const data = await response.json();
  
      if (data.success) {
        // Cập nhật trạng thái tác giả để loại bỏ tác giả đã xóa
        setAuthors(prevAuthors => prevAuthors.filter(author => author._id !== id));
        alert('Xóa tác giả thành công');
      } else {
        alert('Xóa tác giả thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi xóa tác giả:', error);
      alert('Có lỗi xảy ra khi xóa tác giả');
    }
  };
  

  const handleDetailsClick = (author) => {
    setCurrentAuthor(author);
    setShowDetailsModal(true);
  };
  

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    try {

      if (editingAuthor) {
        // Cập nhật tác giả
        const response = await fetch(`http://localhost:8181/api/tacgia//${editingAuthor._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAuthor)
        });
        const data = await response.json();
        if (data.status) {
          setAuthors(authors.map(author => (author._id === editingAuthor._id ? newAuthor : author)));
        } else {
          console.error("Cập nhật tác giả thất bại:", data.message);
        }
      } else {
        console.log(newAuthor);

        const response = await fetch(`${process.env.REACT_APP_URL}tacgia`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAuthor)
        });
        const data = await response.json();
        if (data.status) {
          setAuthors([...authors, newAuthor]);
        } else {
          console.error("Thêm tác giả thất bại:", data.message);

        }
      }
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu tác giả:", error);
    }
  };
  
  
  const handleEditAuthorClick = (author) => {
    setEditingAuthor(author);
    setNewAuthor({
      ten: author.ten,
      img: author.img,
      tieusu: author.tieusu,
      id_hienthi: author.id_hienthi
    });
    setShowModal(true);
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
          <li className={styles.active}>
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
                <h3>Tác Giả</h3>
                <div className={styles.bgadd}>
                  <a href="#" className={styles.add} onClick={handleAddAuthorClick}>+ Thêm</a>
                </div>
                <i className={styles.bx}></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Stt</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Tiểu Sử</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody id="author-table-body">
                  {currentAuthors.map((author,index) => (
                    <tr key={author._id}>
                      <td className={styles.deid}>{indexOfFirstAuthor + index + 1}</td>
                      <td><img src={author.img} alt="" /></td>
                      <td>{author.ten}</td>
                      <td className={styles.tieusutd}>{author.tieusu}</td>
                      <td className={styles.tthai}>{author.trangthai ? 'True' : 'False'}</td>
                      <td>
                        <button className={styles.delete} onClick={() => handleDeleteAuthor(author._id)}><MdDelete /></button>
                        <button className={styles.edit} onClick={() => handleEditAuthorClick(author)}><FaEdit /></button>
                        <button className={styles.details} onClick={() => handleDetailsClick(author)}><FaEye /></button>
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
            <span className={styles.close} onClick={handleCloseModal}>x</span>
            <h2>{editingAuthor ? "Chỉnh Sửa Tác Giả" : "Thêm Tác Giả Mới"}</h2>
            <form onSubmit={editingAuthor ? handleSaveAuthor : handleAddAuthor}>

              <label>Tên:</label>
              <input
                type="text"
                name="ten"
                value={newAuthor.ten}
                onChange={handleInputChange}
                required
              />
         <label>Ảnh:</label>
<input
  type="file"
  name="img"
  onChange={handleInputChange} 
/>

              <label className={styles.block}>Tiểu sử:</label>
              <textarea
                name="tieusu"
                value={newAuthor.tieusu}
                onChange={handleInputChange}
                
              />
    <label>Hiển thị:</label>
<select 
  id="hienthi" 
  name="hienthi" 
  value={newAuthor.hienthi ? 'true' : 'false'} 
  onChange={handleInputChange}
>
  <option value="true">True</option>
  <option value="false">False</option>
</select>

              <button type="submit">{editingAuthor ? "Cập Nhật" : "Thêm"}</button>
            </form>
          </div>
        </div>
      )}

{showDetailsModal && currentAuthor && (
        <div className={styles.modall}>
          <div className={styles.modalContentt}>
            <span className={styles.close} onClick={handleCloseDetailsModal}>x</span>
            <h2>Chi Tiết Tác Giả</h2>
            <div>
              <label>Tên:</label>
              <p>{currentAuthor.ten}</p>
            </div>
            <div>
              <img src={currentAuthor.img} alt="" className={styles.detailImage} style={{ maxWidth: '100px' }}/>
            </div>
            <div>
              <label>Tiểu sử:</label>
              <p>{currentAuthor.tieusu}</p>
            </div>
            <div>
              <label>Trạng Thái:</label>
              <p>{currentAuthor.trangthai ? 'True' : 'False'}</p>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default TacGia;
