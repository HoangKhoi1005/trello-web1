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
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

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

  // useEffect để cập nhật lại danh sách cột khi board thay đổi
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))// Sắp xếp các cột theo thứ tự được định nghĩa trong columnOrderIds
  }, [board])

  // Tìm column chứa card theo cardId
  const findColumnByCardId = (cardId) => {
    //includes(cardId) kiểm tra xem cardId có trong danh sách id của các card không, nếu có thì trả về true, không thì trả về false, nếu tìm thấy thì trả về column, không tìm thấy thì trả về null
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đầu kéo thì lưu lại thông tin của item đó
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kéo qua một phần tử
  const handleDragOver = (event) => {
    // Không làm gì nếu kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN)
      return

    // console.log('handleDragOver: ', event)
    const { active, over } = event

    if (!active || !over) return // Nếu không có cột nào được kéo qua thì return tránh lỗi

    // activeDraggingCard: thẻ đang kéo, overCard: thẻ bị kéo qua
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // console.log('overColumn: ', overColumn)

    // Nếu không tìm thấy column nào thì không làm gì cả
    if (!activeColumn || !overColumn) return

    // Xử lý logic khi kéo card qua 2 column khác nhau, còn nếu kéo card trong cùng 1 column thì không xử lý
    // Vì đây là xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí (index) của overCard trong column đích (nơi mà activeCard sẽ bị kéo qua)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnsState cũ ra một cái mới để xủ lý data rồi return - cập nhật lại OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumns)
        const nextAcviteColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        // nextAcviteColumn: Column cũ
        if (nextAcviteColumn) {
          // Xóa card đang kéo khỏi cột hiện tại
          nextAcviteColumn.cards = nextAcviteColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại danh sách id của các card trong cột
          nextAcviteColumn.cardOrderIds = nextAcviteColumn.cards.map(card => card._id)
        }
        // nextOverColumn: Column mới
        if (nextOverColumn) {
          // Kiểm tra card đang kéo qua có trong cột đích hay không, nếu có thì xóa nó đi trước khi thêm
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Thêm card đang kéo vào overColumn ở vị trí mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // Cập nhật lại danh sách id của các card trong cột
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  // Trigger khi kết thúc kéo một phần tử => thả một phần tử
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Hành động kéo thả card - Không xử lý')
      return
    }

    const { active, over } = event

    if (!active || !over) return // Nếu không có cột nào được kéo qua thì return tránh lỗi

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
    // DndContext: cung cấp context để xác định vùng kéo thả, sensors: xác định loại sensor sử dụng, onDragStart: trigger khi bắt đầu kéo, onDragEnd: trigger khi kết thúc kéo
    <DndContext
      // sensors: Cảm biến để xác định vị trí con trỏ chuột hoặc cảm ứng, ở đây sử dụng cảm biến chuột và cảm ứng
      sensors={sensors}
      // closestCorners: Thuật toán phát hiện va chạm, ở đây sử dụng thuật toán góc gần nhất (nếu không có thì card với cover lớn sẽ không kéo qua được column khác vì lúc này đang bị conflict giữa card và column)
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
