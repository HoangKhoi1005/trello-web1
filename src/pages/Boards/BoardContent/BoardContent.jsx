import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Cùng 1 thời điểm chỉ có 1 item được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))// Sắp xếp các cột theo thứ tự được định nghĩa trong columnOrderIds
  }, [board])

  // Trigger khi bắt đầu kéo thì lưu lại thông tin của item đó
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kết thúc kéo một phần tử => thả một phần tử
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // Custom drop animation: thay đổi opacity của item khi kéo qua
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        padding: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
