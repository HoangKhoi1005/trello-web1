import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'


const MENU_STYLES = {
  color:'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="HoangKhoiDev"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automations"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={ <PersonAddIcon/> }>Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16
            }
          }}
          >
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/275253747_1072102423713589_4612179048140960110_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFXLmledEki0IJrIZG56lUYLlgfC2oNXtAuWB8Lag1e0BhIdURdF0Zv82HzYLgFvxkhgEvpEyBM9xONwlzGv4Bt&_nc_ohc=0DftG3g4P1cQ7kNvgEMKrQf&_nc_ht=scontent.fsgn5-10.fna&gid=Aa1Pn0UNWd6eVdf26MOitd0&oh=00_AYCCztGFbKHBdYH1-dF1rcINGqrAMjYA_JCKD4mFuBhdGw&oe=668CCA96" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/cartoon-portrait-girl-with-aviator-glasses-bomber-jacket_1015980-392029.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/dazzling-symmetry-exploring-sparklecore-through-neon-men-with-terrapin-tortoise-shell-frame-eye-gla_1015980-40289.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/shades-nostalgia-unveiling-cool-boy-through-80s-anime-art_1015980-16809.jpg?w=826" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/rediscovering-fiery-spirit-capturing-anime-essence-22yearold-redhaired-male_1015980-94713.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/enigmatic-charm-anime-aesthetic-journey-through-sandara-tang-luminous-dreamscapes-kris_1015980-50159.jpg?w=360" />
          </Tooltip>

          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/275253747_1072102423713589_4612179048140960110_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFXLmledEki0IJrIZG56lUYLlgfC2oNXtAuWB8Lag1e0BhIdURdF0Zv82HzYLgFvxkhgEvpEyBM9xONwlzGv4Bt&_nc_ohc=0DftG3g4P1cQ7kNvgEMKrQf&_nc_ht=scontent.fsgn5-10.fna&gid=Aa1Pn0UNWd6eVdf26MOitd0&oh=00_AYCCztGFbKHBdYH1-dF1rcINGqrAMjYA_JCKD4mFuBhdGw&oe=668CCA96" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/cartoon-portrait-girl-with-aviator-glasses-bomber-jacket_1015980-392029.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/dazzling-symmetry-exploring-sparklecore-through-neon-men-with-terrapin-tortoise-shell-frame-eye-gla_1015980-40289.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/shades-nostalgia-unveiling-cool-boy-through-80s-anime-art_1015980-16809.jpg?w=826" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/rediscovering-fiery-spirit-capturing-anime-essence-22yearold-redhaired-male_1015980-94713.jpg?w=740" />
          </Tooltip>
          <Tooltip title="HoangKhoiDev">
            <Avatar alt="HoangKhoiDev" src="https://img.freepik.com/premium-photo/enigmatic-charm-anime-aesthetic-journey-through-sandara-tang-luminous-dreamscapes-kris_1015980-50159.jpg?w=360" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
