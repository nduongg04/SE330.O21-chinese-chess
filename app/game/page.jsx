import React from 'react';

const Table = () => {
  const data = [
    {
      stt: 1,
      noiDung: 'Nội dung 1',
      tienCong: 1000,
      vatTuPhuTung: ['Vật tư 1', 'Vật tư 2'],
      soLuong: [1, 2],
      donGia: [500, 600],
      thanhTien: 2000
    },
    // Thêm dữ liệu khác vào đây...
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Nội dung</th>
          <th>Tiền công</th>
          <th>Vật tư phụ tùng</th>
          <th>Số lượng</th>
          <th>Đơn giá</th>
          <th>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.stt}</td>
            <td>{item.noiDung}</td>
            <td>{item.tienCong}</td>
            <td>
              {item.vatTuPhuTung.map((vatTu, index) => (
                <div key={index}>{vatTu}</div>
              ))}
            </td>
            <td>
              {item.soLuong.map((soLuong, index) => (
                <div key={index}>{soLuong}</div>
              ))}
            </td>
            <td>
              {item.donGia.map((donGia, index) => (
                <div key={index}>{donGia}</div>
              ))}
            </td>
            <td>{item.thanhTien}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;