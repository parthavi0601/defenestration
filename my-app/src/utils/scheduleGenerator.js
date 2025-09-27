// src/utils/scheduleGenerator.js - AI SCHEDULE GENERATOR

import { DUMMY_STAFF, DUMMY_ROLES, DUMMY_SHOPS } from '../data/dummyData';

export class ScheduleGenerator {
  constructor() {
    this.shopOperatingHours = {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "08:00", close: "21:00" }
    };
  }

  // Generate optimal weekly schedule
  generateWeeklySchedule(shopId = 1, startDate = null) {
    console.log('🤖 Generating AI-powered schedule...');
    
    const shop = DUMMY_SHOPS.find(s => s.id === shopId);
    const shopStaff = DUMMY_STAFF.filter(s => s.shop_id === shopId && s.is_active);
    
    // Get week dates
    const weekDates = this.getWeekDates(startDate);
    const schedule = {
      shop_id: shopId,
      week_start: weekDates[0],
      generated_at: new Date().toISOString(),
      shifts: []
    };

    // Generate shifts for each day
    weekDates.forEach((date, dayIndex) => {
      const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayIndex];
      const dayShifts = this.generateDaySchedule(date, dayName, shopStaff, shop);
      schedule.shifts.push(...dayShifts);
    });

    console.log(`✅ Generated ${schedule.shifts.length} shifts for the week`);
    return schedule;
  }

  // Generate schedule for a single day
  generateDaySchedule(date, dayName, staff, shop) {
    const shifts = [];
    
    // Define shift patterns based on day
    const shiftPatterns = this.getShiftPatterns(dayName);
    
    // Assign staff to shifts using AI logic
    shiftPatterns.forEach(pattern => {
      const assignedStaff = this.assignStaffToShift(pattern, staff, date, dayName);
      
      assignedStaff.forEach(staffMember => {
        shifts.push({
          id: Date.now() + Math.random(),
          staff_id: staffMember.id,
          staff_name: `${staffMember.first_name} ${staffMember.last_name}`,
          role_id: staffMember.role_id,
          role_name: DUMMY_ROLES.find(r => r.id === staffMember.role_id)?.name || 'Staff',
          shift_date: date,
          start_time: pattern.start_time,
          end_time: pattern.end_time,
          status: 'pending_approval',
          shop_id: shop.id,
          shift_type: pattern.type,
          estimated_customers: pattern.estimated_customers,
          priority_score: this.calculatePriorityScore(staffMember, pattern, dayName)
        });
      });
    });
    
    return shifts;
  }

  // Define shift patterns based on business needs
  getShiftPatterns(dayName) {
    const patterns = [];
    
    // Weekend patterns
    if (dayName === 'saturday' || dayName === 'sunday') {
      patterns.push(
        { 
          type: 'morning', 
          start_time: '08:00', 
          end_time: '16:00', 
          roles_needed: ['cashier', 'barista'], 
          min_staff: 2,
          estimated_customers: dayName === 'saturday' ? 150 : 100
        },
        { 
          type: 'evening', 
          start_time: '14:00', 
          end_time: '22:00', 
          roles_needed: ['cashier', 'barista'], 
          min_staff: 2,
          estimated_customers: dayName === 'saturday' ? 180 : 120
        }
      );
    } 
    // Weekday patterns
    else {
      patterns.push(
        { 
          type: 'morning_rush', 
          start_time: '08:00', 
          end_time: '16:00', 
          roles_needed: ['cashier', 'barista'], 
          min_staff: 2,
          estimated_customers: 80
        },
        { 
          type: 'evening', 
          start_time: '12:00', 
          end_time: '20:00', 
          roles_needed: ['cashier', 'barista'], 
          min_staff: 2,
          estimated_customers: 100
        }
      );
    }
    
    return patterns;
  }

  // AI-powered staff assignment
  assignStaffToShift(pattern, availableStaff, date, dayName) {
    const assigned = [];
    const roleMapping = {
      'cashier': 1,
      'barista': 2, 
      'shift_manager': 3,
      'sales_associate': 4
    };

    // Sort staff by suitability score
    const suitableStaff = availableStaff
      .filter(staff => this.isStaffAvailable(staff, dayName))
      .map(staff => ({
        ...staff,
        suitability_score: this.calculateSuitabilityScore(staff, pattern, dayName)
      }))
      .sort((a, b) => b.suitability_score - a.suitability_score);

    // Assign by role priority
    pattern.roles_needed.forEach(roleName => {
      const roleId = roleMapping[roleName];
      const staffForRole = suitableStaff.find(s => 
        s.role_id === roleId && !assigned.find(a => a.id === s.id)
      );
      
      if (staffForRole) {
        assigned.push(staffForRole);
      }
    });

    // Fill remaining spots with best available
    while (assigned.length < pattern.min_staff && assigned.length < suitableStaff.length) {
      const nextBest = suitableStaff.find(s => !assigned.find(a => a.id === s.id));
      if (nextBest) assigned.push(nextBest);
    }

    return assigned;
  }

  // Check if staff is available for the shift
  isStaffAvailable(staff, dayName) {
    const availabilityPatterns = {
      1: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // Alice - weekdays
      2: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], // Bob
      3: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], // Carol
      4: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] // David
    };
    
    return availabilityPatterns[staff.id]?.includes(dayName) || false;
  }

  // Calculate suitability score for staff-shift matching
  calculateSuitabilityScore(staff, pattern, dayName) {
    let score = 0;
    
    // Role match bonus
    const rolePreferences = {
      1: ['morning_rush'], // Cashier prefers morning
      2: ['morning_rush', 'evening'], // Barista flexible
      3: ['evening'], // Manager prefers evening
      4: ['evening'] // Sales associate for evening
    };
    
    if (rolePreferences[staff.role_id]?.includes(pattern.type)) {
      score += 10;
    }
    
    // Experience bonus
    const hireDate = new Date(staff.hire_date);
    const experienceMonths = (new Date() - hireDate) / (1000 * 60 * 60 * 24 * 30);
    score += Math.min(experienceMonths * 0.5, 5);
    
    return score;
  }

  // Calculate priority score for shift importance
  calculatePriorityScore(staff, pattern, dayName) {
    let score = pattern.estimated_customers * 0.1;
    
    if (dayName === 'friday' || dayName === 'saturday') score += 2;
    if (pattern.type === 'morning_rush') score += 1.5;
    
    return Math.round(score * 10) / 10;
  }

  // Get week dates starting from Monday
  getWeekDates(startDate = null) {
    const today = startDate ? new Date(startDate) : new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    return weekDates;
  }

  // Generate schedule summary
  generateScheduleSummary(schedule) {
    const summary = {
      total_shifts: schedule.shifts.length,
      total_hours: 0,
      staff_distribution: {},
      estimated_labor_cost: 0
    };

    schedule.shifts.forEach(shift => {
      const hours = this.calculateShiftHours(shift.start_time, shift.end_time);
      summary.total_hours += hours;
      
      const staffName = shift.staff_name;
      summary.staff_distribution[staffName] = (summary.staff_distribution[staffName] || 0) + hours;
      
      const staff = DUMMY_STAFF.find(s => s.id === shift.staff_id);
      summary.estimated_labor_cost += hours * staff.pay_rate;
    });

    return summary;
  }

  // Calculate hours between two times
  calculateShiftHours(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  }
}

export default new ScheduleGenerator();
