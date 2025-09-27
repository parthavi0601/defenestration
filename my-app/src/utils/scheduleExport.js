// src/utils/scheduleExport.js - SCHEDULE EXPORT UTILITIES

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export class ScheduleExporter {
  // Export schedule as CSV
  async exportToCSV(schedule, summary) {
    try {
      console.log('📄 Generating CSV export...');
      
      const csvContent = this.generateCSVContent(schedule, summary);
      const fileName = `coffee_corner_schedule_${schedule.week_start}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Schedule CSV',
        });
      }
      
      console.log('✅ CSV exported successfully');
      return { success: true, message: 'CSV exported successfully!' };
      
    } catch (error) {
      console.error('❌ CSV export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Export schedule as PDF
  async exportToPDF(schedule, summary) {
    try {
      console.log('📄 Generating PDF export...');
      
      const htmlContent = this.generatePDFHTML(schedule, summary);
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        fileName: `coffee_corner_schedule_${schedule.week_start}`,
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export Schedule PDF',
        });
      }
      
      console.log('✅ PDF exported successfully');
      return { success: true, message: 'PDF exported successfully!' };
      
    } catch (error) {
      console.error('❌ PDF export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate CSV content
  generateCSVContent(schedule, summary) {
    let csv = 'Date,Day,Staff Name,Role,Start Time,End Time,Hours,Status,Estimated Customers\n';
    
    // Sort shifts by date and start time
    const sortedShifts = schedule.shifts.sort((a, b) => {
      const dateCompare = new Date(a.shift_date) - new Date(b.shift_date);
      if (dateCompare !== 0) return dateCompare;
      return a.start_time.localeCompare(b.start_time);
    });
    
    sortedShifts.forEach(shift => {
      const date = new Date(shift.shift_date).toLocaleDateString();
      const day = new Date(shift.shift_date).toLocaleDateString('en-US', { weekday: 'long' });
      const hours = this.calculateHours(shift.start_time, shift.end_time);
      
      csv += `"${date}","${day}","${shift.staff_name}","${shift.role_name}","${shift.start_time}","${shift.end_time}",${hours},"${shift.status}",${shift.estimated_customers || 0}\n`;
    });
    
    // Add summary section
    csv += '\n--- SCHEDULE SUMMARY ---\n';
    csv += `Total Shifts,${summary.total_shifts}\n`;
    csv += `Total Hours,${summary.total_hours}\n`;
    csv += `Estimated Labor Cost,₹${Math.round(summary.estimated_labor_cost)}\n`;
    csv += '\nStaff Distribution:\n';
    
    Object.entries(summary.staff_distribution).forEach(([name, hours]) => {
      csv += `"${name}",${hours} hours\n`;
    });
    
    return csv;
  }

  // Generate PDF HTML content
  generatePDFHTML(schedule, summary) {
    const weekStart = new Date(schedule.week_start).toLocaleDateString();
    const weekEnd = new Date(schedule.week_start);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Coffee Corner Weekly Schedule</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #6366f1;
          padding-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #6366f1;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
        }
        .summary {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .summary-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #10b981;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-value {
          font-size: 20px;
          font-weight: bold;
          color: #6366f1;
        }
        .summary-label {
          font-size: 12px;
          color: #666;
        }
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .schedule-table th,
        .schedule-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .schedule-table th {
          background-color: #6366f1;
          color: white;
          font-weight: bold;
        }
        .schedule-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .day-header {
          background-color: #10b981 !important;
          color: white;
          font-weight: bold;
        }
        .role-badge {
          background-color: #e0e7ff;
          color: #6366f1;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          background-color: #fef3c7;
          color: #92400e;
        }
        .staff-distribution {
          margin-top: 30px;
        }
        .distribution-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #6366f1;
        }
        .distribution-item {
          margin-bottom: 8px;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">☕ Coffee Corner Weekly Schedule</div>
        <div class="subtitle">Week of ${weekStart} - ${weekEnd.toLocaleDateString()}</div>
        <div class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
      </div>

      <div class="summary">
        <div class="summary-title">📊 Schedule Summary</div>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${summary.total_shifts}</div>
            <div class="summary-label">Total Shifts</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${summary.total_hours}h</div>
            <div class="summary-label">Total Hours</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">₹${Math.round(summary.estimated_labor_cost).toLocaleString()}</div>
            <div class="summary-label">Labor Cost</div>
          </div>
        </div>
      </div>

      ${this.generateScheduleTableHTML(schedule)}

      <div class="staff-distribution">
        <div class="distribution-title">👥 Staff Hour Distribution</div>
        ${Object.entries(summary.staff_distribution).map(([name, hours]) => 
          `<div class="distribution-item">
            <strong>${name}:</strong> ${hours} hours
          </div>`
        ).join('')}
      </div>

      <div class="footer">
        Generated by Coffee Corner AI Scheduler • All times are in local time zone
      </div>
    </body>
    </html>
    `;
  }

  // Generate schedule table HTML
  generateScheduleTableHTML(schedule) {
    const groupedByDate = this.groupShiftsByDate(schedule.shifts);
    let tableHTML = '<table class="schedule-table">';
    
    // Table header
    tableHTML += `
      <tr>
        <th>Day/Date</th>
        <th>Staff Member</th>
        <th>Role</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Hours</th>
        <th>Status</th>
        <th>Expected Customers</th>
      </tr>
    `;
    
    Object.entries(groupedByDate).forEach(([date, shifts]) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const dateFormatted = new Date(date).toLocaleDateString();
      
      shifts.forEach((shift, index) => {
        const hours = this.calculateHours(shift.start_time, shift.end_time);
        
        tableHTML += '<tr>';
        
        if (index === 0) {
          tableHTML += `<td rowspan="${shifts.length}" class="day-header">
            <strong>${dayName}</strong><br>
            ${dateFormatted}
          </td>`;
        }
        
        tableHTML += `
          <td><strong>${shift.staff_name}</strong></td>
          <td><span class="role-badge">${shift.role_name}</span></td>
          <td>${shift.start_time}</td>
          <td>${shift.end_time}</td>
          <td>${hours}h</td>
          <td><span class="status-badge">${shift.status.replace('_', ' ')}</span></td>
          <td>${shift.estimated_customers || '-'}</td>
        `;
        
        tableHTML += '</tr>';
      });
    });
    
    tableHTML += '</table>';
    return tableHTML;
  }

  // Group shifts by date
  groupShiftsByDate(shifts) {
    return shifts
      .sort((a, b) => new Date(a.shift_date) - new Date(b.shift_date))
      .reduce((grouped, shift) => {
        const date = shift.shift_date;
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(shift);
        grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
        return grouped;
      }, {});
  }

  // Calculate hours between times
  calculateHours(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  }

  // Generate tabular data for display
  generateTableData(schedule) {
    const groupedByDate = this.groupShiftsByDate(schedule.shifts);
    const tableData = [];
    
    Object.entries(groupedByDate).forEach(([date, shifts]) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const dateFormatted = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      shifts.forEach(shift => {
        tableData.push({
          day: `${dayName} ${dateFormatted}`,
          staff: shift.staff_name,
          role: shift.role_name,
          time: `${shift.start_time} - ${shift.end_time}`,
          hours: this.calculateHours(shift.start_time, shift.end_time),
          status: shift.status.replace('_', ' '),
          customers: shift.estimated_customers || 0
        });
      });
    });
    
    return tableData;
  }
}

export default new ScheduleExporter();
