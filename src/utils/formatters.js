/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * Video 37.2: Xử lý bug logic thư viện dnd-kit khi column rỗng:
 * Phía FE sẽ tạo 1 card đặc biệt: Placeholder Card, không liên quan đến BE
 * Card này sẽ ẩn trên UI người dùng
 * Cấu trúc Id của card này để Unique rất đơn giản, không làm random như các card thông thường
 * "columnId-placeholder-card": mỗi column có tối đa 1 Placeholder Card
 * Quan trọng là khi tạo phải đầy đủ: (id, boardId, columnId, FE_PlaceholderCard: true)
 */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}