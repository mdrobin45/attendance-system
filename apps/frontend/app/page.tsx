"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import type { AttendanceRecord, User as UserType } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { Clock, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function AttendancePage() {
   const [user, setUser] = useState<UserType | null>(null);
   const [employeeId, setEmployeeId] = useState("");
   const [password, setPassword] = useState("");
   const [loginError, setLoginError] = useState("");
   const [attendanceRecords, setAttendanceRecords] = useState<
      AttendanceRecord[]
   >([]);
   const [clockedIn, setClockedIn] = useState(false);
   const [currentTime, setCurrentTime] = useState(new Date());

   // Update current time every second
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   // Mock login function
   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();

      // In a real app, this would validate against a backend
      if (employeeId === "EMP001" && password === "password") {
         setUser({
            id: "EMP001",
            name: "Robin Rana",
            department: "Engineering",
         });
         setLoginError("");

         // Load mock attendance data
         setAttendanceRecords([
            {
               id: "1",
               date: "2024-05-18",
               clockIn: "09:00:00",
               clockOut: "17:30:00",
               totalHours: "8.5",
            },
            {
               id: "2",
               date: "2024-05-17",
               clockIn: "08:45:00",
               clockOut: "17:15:00",
               totalHours: "8.5",
            },
            {
               id: "3",
               date: "2024-05-16",
               clockIn: "09:15:00",
               clockOut: "18:00:00",
               totalHours: "8.75",
            },
         ]);
      } else {
         setLoginError("Invalid employee ID or password");
      }
   };

   const handleLogout = () => {
      setUser(null);
      setEmployeeId("");
      setPassword("");
      setClockedIn(false);
   };

   const handleClockIn = () => {
      const now = new Date();
      const newRecord: AttendanceRecord = {
         id: String(attendanceRecords.length + 1),
         date: formatDate(now),
         clockIn: formatTime(now),
         clockOut: "",
         totalHours: "",
      };

      setAttendanceRecords([newRecord, ...attendanceRecords]);
      setClockedIn(true);
   };

   const handleClockOut = () => {
      const now = new Date();
      const updatedRecords = [...attendanceRecords];
      const todayRecord = updatedRecords[0];

      if (todayRecord && !todayRecord.clockOut) {
         const clockInTime = new Date(
            `${todayRecord.date}T${todayRecord.clockIn}`
         );
         const diffMs = now.getTime() - clockInTime.getTime();
         const diffHrs = diffMs / (1000 * 60 * 60);

         todayRecord.clockOut = formatTime(now);
         todayRecord.totalHours = diffHrs.toFixed(2);

         setAttendanceRecords(updatedRecords);
         setClockedIn(false);
      }
   };

   if (!user) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
               <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                     Employee Attendance
                  </CardTitle>
                  <CardDescription className="text-center">
                     Enter your employee ID and password to sign in
                  </CardDescription>
               </CardHeader>
               <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                           id="employeeId"
                           placeholder="Enter your employee ID"
                           value={employeeId}
                           onChange={(e) => setEmployeeId(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                           id="password"
                           type="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                        />
                     </div>
                     {loginError && (
                        <p className="text-sm font-medium text-red-500">
                           {loginError}
                        </p>
                     )}
                  </CardContent>
                  <CardFooter>
                     <Button type="submit" className="w-full">
                        Sign In
                     </Button>
                  </CardFooter>
               </form>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto py-6 px-4">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
               <h1 className="text-3xl font-bold">Attendance Management</h1>
               <p className="text-muted-foreground">
                  Track your work hours and attendance
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                  <span className="text-muted-foreground">
                     ({user.department})
                  </span>
               </div>
               <Button variant="outline" onClick={handleLogout}>
                  Logout
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1">
               <CardHeader>
                  <CardTitle>Current Time</CardTitle>
                  <CardDescription>Your local time</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-2">
                     <Clock className="h-12 w-12 text-primary" />
                     <p className="text-3xl font-bold">
                        {currentTime.toLocaleTimeString()}
                     </p>
                     <p className="text-muted-foreground">
                        {currentTime.toLocaleDateString()}
                     </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
               <CardHeader>
                  <CardTitle>Clock In/Out</CardTitle>
                  <CardDescription>Record your attendance</CardDescription>
               </CardHeader>
               <CardContent className="flex justify-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button
                        size="lg"
                        className="flex items-center gap-2"
                        onClick={handleClockIn}
                        disabled={clockedIn}>
                        <LogIn className="h-5 w-5" />
                        Clock In
                     </Button>
                     <Button
                        size="lg"
                        variant={clockedIn ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={handleClockOut}
                        disabled={!clockedIn}>
                        <LogOut className="h-5 w-5" />
                        Clock Out
                     </Button>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                     {clockedIn
                        ? "You are currently clocked in. Don't forget to clock out at the end of your shift."
                        : "You are currently clocked out. Click 'Clock In' when you start your shift."}
                  </p>
               </CardFooter>
            </Card>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Attendance History</CardTitle>
               <CardDescription>
                  View your recent attendance records
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead className="text-right">
                           Total Hours
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                           <TableCell>{record.date}</TableCell>
                           <TableCell>{record.clockIn}</TableCell>
                           <TableCell>
                              {record.clockOut || "Not clocked out"}
                           </TableCell>
                           <TableCell className="text-right">
                              {record.totalHours || "-"}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
                  {attendanceRecords.length === 0 && (
                     <TableCaption>No attendance records found.</TableCaption>
                  )}
               </Table>
            </CardContent>
         </Card>
      </div>
   );
}
