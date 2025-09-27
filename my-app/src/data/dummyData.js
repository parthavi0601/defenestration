// src/data/dummyData.js - DUMMY DATA STORE

export const DUMMY_OWNER = {
  id: 1,
  username: "demo_owner",
  password: "password123",
  first_name: "John",
  last_name: "Smith", 
  email: "john.smith@coffeecorner.com",
  mobile_number: "9876543210",
  shops: [1, 2]
}

export const DUMMY_SHOPS = [
  {
    id: 1,
    shop_name: "Coffee Corner - Main Street",
    address: "123 Main Street, Downtown",
    city: "Mumbai",
    state: "Maharashtra", 
    country: "India",
    phone_number: "022-12345678",
    owner_id: 1,
    operating_hours: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "08:00", close: "21:00" }
    }
  }
]

export const DUMMY_STAFF = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Johnson", 
    phone: "9876543210",
    email: "alice@coffeecorner.com",
    role_id: 1,
    shop_id: 1,
    pay_rate: 250.00,
    hire_date: "2024-01-15",
    is_active: true
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Wilson",
    phone: "8765432109", 
    email: "bob@coffeecorner.com",
    role_id: 2,
    shop_id: 1,
    pay_rate: 280.00,
    hire_date: "2024-02-01",
    is_active: true
  },
  {
    id: 3,
    first_name: "Carol",
    last_name: "Davis",
    phone: "7654321098",
    email: "carol@coffeecorner.com", 
    role_id: 1,
    shop_id: 1,
    pay_rate: 250.00,
    hire_date: "2024-01-20",
    is_active: true
  },
  {
    id: 4,
    first_name: "David",
    last_name: "Brown",
    phone: "6543210987",
    email: "david@coffeecorner.com",
    role_id: 3, 
    shop_id: 1,
    pay_rate: 320.00,
    hire_date: "2023-11-01",
    is_active: true
  }
]

export const DUMMY_ROLES = [
  { id: 1, name: "Cashier", shop_id: 1, description: "Handle customer transactions" },
  { id: 2, name: "Barista", shop_id: 1, description: "Prepare coffee and beverages" },
  { id: 3, name: "Shift Manager", shop_id: 1, description: "Supervise daily operations" },
  { id: 4, name: "Sales Associate", shop_id: 1, description: "Customer service and sales" }
]

// Generate current week schedule
const generateWeeklySchedule = () => {
  const today = new Date()
  const currentWeek = []
  
  // Get Monday of current week
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    currentWeek.push(date.toISOString().split('T')[0])
  }
  
  return currentWeek
}

export const DUMMY_SCHEDULE = {
  week_start: generateWeeklySchedule()[0],
  shop_id: 1,
  shifts: [
    // Monday
    {
      id: 1,
      staff_id: 1,
      staff_name: "Alice Johnson",
      role_id: 1,
      role_name: "Cashier", 
      shift_date: generateWeeklySchedule()[0],
      start_time: "08:00",
      end_time: "16:00",
      status: "confirmed",
      shop_id: 1
    },
    {
      id: 2,
      staff_id: 2,
      staff_name: "Bob Wilson",
      role_id: 2,
      role_name: "Barista",
      shift_date: generateWeeklySchedule()[0], 
      start_time: "12:00",
      end_time: "20:00",
      status: "confirmed",
      shop_id: 1
    },
    
    // Tuesday  
    {
      id: 3,
      staff_id: 2,
      staff_name: "Bob Wilson",
      role_id: 2,
      role_name: "Barista",
      shift_date: generateWeeklySchedule()[1],
      start_time: "12:00", 
      end_time: "20:00",
      status: "confirmed",
      shop_id: 1
    },
    {
      id: 4,
      staff_id: 3,
      staff_name: "Carol Davis", 
      role_id: 1,
      role_name: "Cashier",
      shift_date: generateWeeklySchedule()[1],
      start_time: "12:00",
      end_time: "18:00", 
      status: "confirmed",
      shop_id: 1
    },
    
    // Wednesday
    {
      id: 5,
      staff_id: 1,
      staff_name: "Alice Johnson",
      role_id: 1, 
      role_name: "Cashier",
      shift_date: generateWeeklySchedule()[2],
      start_time: "08:00",
      end_time: "16:00",
      status: "confirmed", 
      shop_id: 1
    },
    {
      id: 6,
      staff_id: 4,
      staff_name: "David Brown",
      role_id: 3,
      role_name: "Shift Manager",
      shift_date: generateWeeklySchedule()[2],
      start_time: "09:00",
      end_time: "17:00",
      status: "confirmed",
      shop_id: 1
    },
    
    // Thursday
    {
      id: 7,
      staff_id: 2,
      staff_name: "Bob Wilson", 
      role_id: 2,
      role_name: "Barista",
      shift_date: generateWeeklySchedule()[3],
      start_time: "12:00",
      end_time: "20:00",
      status: "confirmed",
      shop_id: 1
    },
    {
      id: 8,
      staff_id: 3,
      staff_name: "Carol Davis",
      role_id: 1,
      role_name: "Cashier", 
      shift_date: generateWeeklySchedule()[3],
      start_time: "12:00",
      end_time: "18:00",
      status: "confirmed",
      shop_id: 1
    },
    
    // Friday
    {
      id: 9,
      staff_id: 1,
      staff_name: "Alice Johnson",
      role_id: 1,
      role_name: "Cashier",
      shift_date: generateWeeklySchedule()[4],
      start_time: "08:00", 
      end_time: "16:00",
      status: "confirmed",
      shop_id: 1
    },
    {
      id: 10,
      staff_id: 4,
      staff_name: "David Brown",
      role_id: 3,
      role_name: "Shift Manager",
      shift_date: generateWeeklySchedule()[4],
      start_time: "09:00",
      end_time: "17:00",
      status: "confirmed",
      shop_id: 1
    },
    
    // Saturday
    {
      id: 11,
      staff_id: 2,
      staff_name: "Bob Wilson",
      role_id: 2, 
      role_name: "Barista",
      shift_date: generateWeeklySchedule()[5],
      start_time: "10:00",
      end_time: "18:00",
      status: "confirmed",
      shop_id: 1
    },
    {
      id: 12,
      staff_id: 3,
      staff_name: "Carol Davis",
      role_id: 1,
      role_name: "Cashier",
      shift_date: generateWeeklySchedule()[5],
      start_time: "12:00",
      end_time: "20:00",
      status: "confirmed", 
      shop_id: 1
    }
  ]
}

export const getWeekScheduleForStaff = (staffId) => {
  const weekSchedule = []
  const weekDates = generateWeeklySchedule()
  
  weekDates.forEach((date, index) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const shift = DUMMY_SCHEDULE.shifts.find(s => 
      s.staff_id === staffId && s.shift_date === date
    )
    
    if (shift) {
      const today = new Date().toISOString().split('T')[0]
      weekSchedule.push({
        date: date,
        day: dayNames[index],
        shift: `${shift.start_time} - ${shift.end_time}`,
        role: shift.role_name,
        shop: "Coffee Corner - Main Street",
        status: date === today ? "today" : "upcoming"
      })
    } else {
      weekSchedule.push({
        date: date,
        day: dayNames[index], 
        shift: "Off",
        role: "",
        shop: "",
        status: "off"
      })
    }
  })
  
  return weekSchedule
}
