import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaBookReader, FaShoppingCart, FaAlignJustify, FaEdit } from "react-icons/fa";
import { MdDashboard, MdDelete } from "react-icons/md";
import { IoSettings, IoLogOut, IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import styles from './admin.module.scss';
import { MdCategory } from "react-icons/md";
import { FaBimobject } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";

const initialUserState = {
  id_nguoidung: '',
  email: '',
  ten: '',
  gioitinh: 0,
  avt: '',
  sdt: '',
  matkhau: '',
  ngaysinh: '',
  ngaytao: '',
  is_active: true,
  loaitaikhoan: 1,
  
};

const Admin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModalDT, setShowModalDT] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState(initialUserState);
  const [users, setUsers] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8181/api/admin/');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Lỗi khi tải dữ liệu admin");
        }
      } catch (error) {
        console.error("Lỗi khi lấy admin:", error);
      }
    };

    fetchUsers();
  }, []);

  // Logic để lấy người dùng hiện tại trên trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser(initialUserState);
    setShowModalDT(false);  // Đảm bảo rằng `showModalDT` cũng được đóng

  };

  const handleAddUserClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewUser(prevState => ({
            ...prevState,
            [name]: reader.result // Lưu URL của ảnh vào trạng thái
          }));
        };
        reader.readAsDataURL(file); // Đọc tệp ảnh và tạo URL
      }
    } else {
      setNewUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handleShowDetail = (user) => {
    setCurrentUser(user);
    setShowModalDT(true);
  };
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.ten || !newUser.email || !newUser.matkhau) {
      alert('Tên, email, và mật khẩu là bắt buộc!');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8181/api/admin/`, { // Thay URL trực tiếp tại đây
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (data.status === 1) {
        // Nếu thành công, cập nhật danh sách người dùng với ID tạm thời
        setUsers([...users, { ...newUser, _id: Date.now() }]); // Thêm ID tạm thời
        handleCloseModal();
      } else {
        console.error("Thêm người dùng thất bại:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      alert("Lỗi khi thêm người dùng. Vui lòng thử lại sau.");
    }
  };
  
  

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?");
    
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8181/api/admin/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.status) {
          setUsers(users.filter(user => user._id !== id));
          console.log("Người dùng đã được xóa thành công.");
        } else {
          console.error("Failed to delete user:", data.message);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      console.log("Hủy thao tác xóa người dùng.");
    }
  };
  

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8181/api/admin/${newUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_nguoidung: newUser._id, ...newUser }),
      });

      const data = await response.json();

      if (data.status === 1) {
        // Cập nhật danh sách người dùng sau khi chỉnh sửa
        const updatedUsers = users.map(user =>
          user._id === newUser._id ? newUser : user
        );
        setUsers(updatedUsers);
        handleCloseModal();
      } else {
        console.error("Chỉnh sửa người dùng thất bại:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa người dùng:", error);
      alert("Lỗi khi chỉnh sửa người dùng. Vui lòng thử lại sau.");
    }
  };


  const handleEditClick = (user) => {
    setCurrentUser(user);
    setNewUser(user);
    setIsEditing(true);
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
          <li className={styles.active}>
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
          <li>
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
                <h3>Admin</h3>
                <div className={styles.bgadd}>
                  <a href="#" className={styles.add} onClick={handleAddUserClick}>+ Thêm</a>
                </div>
                <i className={styles.bx}></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Stt</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Loại Tài Khoản</th>
                    <th>Email</th>
                    <th>Giới Tính</th>
                    <th>Số Điện Thoại</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody id="user-table-body">
  {currentUsers.map((user,index) => (
    <tr key={user._id}> 
      <td className={styles.deid}>{index + 1 + (currentPage - 1) * usersPerPage}</td>
      <td><img src={user.avt} alt="" /></td>
      <td className={styles.deten}>{user.ten}</td>
      <td>{user.loaitaikhoan === 0 ?  'User' : 'Admin' }</td>
      <td className={styles.deem}>{user.email}</td>
      <td>{user.gioitinh === 0 ? 'Nam' : 'Nữ'}</td>
      <td>{user.sdt}</td>
      <td>{user.is_active ? 'True' : 'False'}</td>
      <td>
        <button className={styles.delete}  onClick={() => handleDeleteUser(user._id)}><MdDelete /></button>
        <button className={styles.edit} onClick={() => handleEditClick(user)}><FaEdit /></button>
        <button className={styles.details} onClick={() => handleShowDetail(user)}><FaEye />
        </button>
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
              <h2>{isEditing ? "Chỉnh sửa Admin" : "Admin Dùng Mới"}</h2>
              <form onSubmit={isEditing ? handleEditUser : handleAddUser}>
                <label>Tên người dùng:</label>
                <input
                  type="text"
                  name="ten"
                  value={newUser.ten}
                  onChange={handleInputChange}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="matkhau"
                  value={newUser.matkhau}
                  onChange={handleInputChange}
                  required
                />
                <label>Giới tính:</label>
                <select
                  name="gioitinh"
                  value={newUser.gioitinh}
                  onChange={handleInputChange}
                >
                  <option value={0}>Nam</option>
                  <option value={1}>Nữ</option>
                </select>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="sdt"
                  value={newUser.sdt}
                  onChange={handleInputChange}
                 
                />
                <label>Ảnh đại diện:</label>
                <input
                  type="file"
                  name="avt"
                  onChange={handleInputChange}
                />
               {newUser.avt && (
  <div>
    <img src={newUser.avt} alt="Ảnh đại diện" style={{ maxWidth: '100px', maxHeight: '100px' }} />
  </div>
)}
                {/* <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="ngaysinh"
                  value={newUser.ngaysinh}
                  onChange={handleInputChange}
                  required
                /> */}
                <label>Loại tài khoản:</label>
                <select
  name="loaitaikhoan"
  value={newUser.loaitaikhoan}
  onChange={handleInputChange}
>
  <option value={1}>Admin</option>
</select>

                <button type="submit">{isEditing ? "Cập nhật" : "Thêm"}</button>
              </form>
            </div>
          </div>
        )}

{showModalDT && currentUser && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={handleCloseModal}>&times;</span>
      <h2>Chi tiết Người Dùng</h2>
      <p>ID: {currentUser._id}</p>
      <p>Tên: {currentUser.ten}</p>
      <p>Email: {currentUser.email}</p>
      <p>Giới tính: {currentUser.gioitinh === 0 ? 'Nam' : 'Nữ'}</p>
      <p>Số điện thoại: {currentUser.sdt}</p>
      <p>Ảnh đại diện: <img src={currentUser.avt} alt="" style={{ maxWidth: '100px' }} /></p>
      {/* <p>Ngày sinh: {currentUser.ngaysinh}</p> */}
      <p>Ngày tạo: {currentUser.ngaytao}</p>
      <p>Trạng thái: {currentUser.is_active ? 'True' : 'False'}</p>
      <p>Loại tài khoản: {currentUser.loaitaikhoan=0 ? 'Admin' : 'User'}</p>
    </div>
  </div>
)}

    </>
  );
};

export default Admin;
