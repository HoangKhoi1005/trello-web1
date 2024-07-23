/**
 * Xác định các phần tử trong array gốc ban đầu (originalArray) xem nó nằm ở đâu trong array thứ 2 (orderArray) (là array mà mình dùng để sắp xếp) bằng cách tìm index (indexOf) rồi sẽ sắp xếp theo index đó bằng hàm sort của Javascript.
 */

export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []
  return [...originalArray].sort((a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]))// Sắp xếp theo index của orderArray, nếu index của a[key] < index của b[key] thì a sẽ đứng trước b, ngược lại b sẽ đứng trước a, nếu index của a[key] = index của b[key] thì a và b sẽ giữ nguyên vị trí, không đổi chỗ.
}