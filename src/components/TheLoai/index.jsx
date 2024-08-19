import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaBookReader, FaShoppingCart, FaAlignJustify, FaEdit, FaBimobject, FaCreditCard, FaCommentAlt } from 'react-icons/fa';
import { MdDashboard, MdCategory, MdDelete } from 'react-icons/md';
import { IoSettings, IoLogOut, IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import styles from './theloai.module.scss';
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  
  const [newCategory, setNewCategory] = useState({
    id_theloai: '',
    ten: '',
    img: '',
    hienthi: true,
  });
  const categoriesPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8181/api/theloai/');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          console.error('Lấy thể loại thất bại');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    };

    fetchCategories();
  }, []);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleShowMore = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  const handleShowAddModal = () => {
    setShowModalAdd(true);
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.ten || !newCategory.img) {
      alert('Tên và ảnh của thể loại là bắt buộc!');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8181/api/theloai/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
  
      const data = await response.json();
  
      if (data.status === 1) {
        setCategories([...categories, { ...newCategory, _id: Date.now() }]); // Giả sử bạn thêm ID tạm thời
        setNewCategory({
          ten: '',
          img: '',
          hienthi: true,
        });
        setShowModalAdd(false);
      } else {
        console.error('Failed to add category:', data.message);
        alert(data.message); 
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Đã xảy ra lỗi khi thêm thể loại sách.');
    }
  };
  const handleDelete = async (id) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa thể loại này không?');
  
    if (!confirmed) {
      // Nếu người dùng không xác nhận, thoát hàm
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8181/api/theloai/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        // Nếu phản hồi không thành công, lấy thông tin lỗi
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đã xảy ra lỗi khi xóa thể loại.');
      }
  
      const data = await response.json();
  
      if (data.status === 1) {
        // Cập nhật danh sách thể loại để loại bỏ thể loại đã xóa
        setCategories(prevCategories => prevCategories.filter(category => category._id !== id));
        alert('Xóa thể loại thành công');
      } else {
        alert(data.message || 'Xóa thể loại không thành công');
      }
    } catch (error) {
      console.error('Lỗi khi xóa thể loại:', error);
      alert('Đã xảy ra lỗi khi xóa thể loại. Vui lòng thử lại.');
    }
  };
  
  
  
  
  

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewCategory(prevState => ({
            ...prevState,
            [name]: reader.result // Lưu URL của ảnh vào trạng thái
          }));
        };
        reader.readAsDataURL(file); // Đọc tệp ảnh và tạo URL
      }
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };
  

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.ten || !newCategory.img) {
      alert('Tên và ảnh của thể loại là bắt buộc!');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8181/api/theloai/${currentCategory._id}`, { // Sử dụng currentCategory._id
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten: newCategory.ten,
          img: newCategory.img,
          hienthi: newCategory.hienthi,
        }), // Chỉ gửi các trường cần thiết
      });
  
      const data = await response.json();
  
      if (data.status === 1) {
        setCategories(categories.map(category => 
          category._id === currentCategory._id ? { ...category, ...newCategory } : category
        ));
        setShowModalEdit(false);
      } else {
        console.error('Failed to update category:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Đã xảy ra lỗi khi cập nhật thể loại sách.');
    }
  };
  
  const handleShowEditModal = (category) => {
    setCurrentCategory(category);
    setNewCategory({
      id_theloai: category._id,
      ten: category.ten,
      img: category.img,
      hienthi: category.hienthi,
    });
    setShowModalEdit(true);
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
          <li className={styles.active}>
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
                <h3>Thể Loại</h3>
                <div className={styles.bgadd}>
                  <a href="#" className={styles.add} onClick={handleShowAddModal}>+ Thêm</a>
                </div>
                <i className={styles.bx}></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Stt</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Hiển Thị</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                {currentCategories.map((category, index) => (
      <tr key={category.id_theloai}>
        <td>{index + 1}</td>
                      <td><img src={category.img} alt="" /></td>
                      <td>{category.ten}</td>
                      <td>{category.hienthi ? 'True' : 'False'}</td>
                      <td>
                        <button className={styles.delete}  onClick={() => handleDelete(category._id)}><MdDelete /></button>
                        <button className={styles.edit} onClick={() => handleShowEditModal(category)}><FaEdit /></button>
                        <button className={styles.details} onClick={() => handleShowMore(category)}><FaEye /></button>
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

      {showModal && currentCategory && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleCloseModal}>&times;</span>
            <h2>Chi tiết Thể Loại</h2>
            <p>ID: {currentCategory._id}</p>
            <p>Tên: {currentCategory.ten}</p>
            <p>Ảnh: <img src={currentCategory.img} alt="" style={{ maxWidth: '100px' }} /></p>
            <p>Hiển Thị: {currentCategory.hienthi ? 'True' : 'False'}</p>
          </div>
        </div>
      )}

      {showModalAdd && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setShowModalAdd(false)}>&times;</span>
            <h2>Thêm Thể Loại Mới</h2>
            <form onSubmit={handleAddCategory}>
  <label htmlFor="ten">Tên:</label>
  <input type="text" id="ten" name="ten" value={newCategory.ten} onChange={handleInputChange} />
  
  <label htmlFor="img">Ảnh:</label>
  <input type="file" id="img" name="img" onChange={handleInputChange} />
  
  <label htmlFor="hienthi">Hiển Thị:</label>
  <select id="hienthi" name="hienthi" value={newCategory.hienthi ? 'true' : 'false'} onChange={handleInputChange}>
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
  
  <button type="submit">Thêm</button>
</form>

          </div>
        </div>
      )}


{showModalEdit && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={() => setShowModalEdit(false)}>&times;</span>
      <h2>Sửa Thể Loại</h2>
      <form onSubmit={handleEditCategory}>
        <label htmlFor="ten">Tên:</label>
        <input type="text" id="ten" name="ten" value={newCategory.ten} onChange={handleInputChange} />

        <label htmlFor="img">Ảnh:</label>
        <input type="file" id="img" name="img" onChange={handleInputChange} />

        <label htmlFor="hienthi">Hiển Thị:</label>
        <select id="hienthi" name="hienthi" value={newCategory.hienthi ? 'true' : 'false'} onChange={handleInputChange}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  </div>
)}
    </>
  );
};

export default Category;
