import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  // PointerSensor,
  MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  // Sử dụng sensor PointerSensor để xác định vị trí con trỏ chuột, cách nhau 10px mới bắt đầu di chuyển, tránh di chuyển khi click chuột
  // Nếu dùng pointerSensor thì phải kết hợp với thuộc tính CSS touchAction: 'none' trong style của Box Column, NHƯNG CÒN LỖI
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Sử dụng sensor MouseSensor để xác định vị trí con trỏ chuột, cách nhau 10px mới bắt đầu di chuyển, tránh di chuyển khi click chuột
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Sử dụng sensor TouchSensor để xác định vị trí con trỏ cảm ứng, delay 250ms, tolerance 500px
  // touchSensor sẽ delay 250ms trước khi bắt đầu di chuyển, và di chuyển khi con trỏ cách nhau 500px
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))// Sắp xếp các cột theo thứ tự được định nghĩa trong columnOrderIds
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    if (!over) return // Nếu không có cột nào được kéo qua thì return tránh lỗi

    // Nếu cột active khác cột over thì mới thực hiện di chuyển
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)// Lấy vị trí cũ từ active
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)// Lấy vị trí mới từ over

      //Dùng arrayMove để sắp xếp lại mảng Columns sau khi di chuyển
      //Code của arrayMove: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)// Di chuyển cột từ vị trí cũ sang vị trí mới
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)// Lấy ra danh sách id mới sau khi di chuyển
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns) // Cập nhật lại danh sách cột sau khi di chuyển
    }

  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        padding: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
