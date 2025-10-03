"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserAccessibleBatteriesQuery } from "@/services/rtk-query";
import { 
  Clock, 
  Users, 
  BookOpen, 
  Play, 
  Calendar,
  Loader2,
  TestTube
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

interface User {
  id: string;
  role: string;
}

export function TakeTestView() {
  const router = useRouter();
  const { authData } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { data: accessibleBatteries = [], isLoading, error } = useGetUserAccessibleBatteriesQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    // Get user data from auth context (which reads from localStorage)
    if (authData.user && authData.user.id) {
      const userData = {
        id: authData.user.id,
        role: authData.user.role,
      };
      setUser(userData);
      setUserId(authData.user.id);
    } else {
      // Fallback: Check localStorage directly if auth context not ready
      try {
        const storedAuthData = localStorage.getItem("evalence_user");
        if (storedAuthData) {
          const parsedUser = JSON.parse(storedAuthData);
          if (parsedUser.user && parsedUser.user.id) {
            const userData = {
              id: parsedUser.user.id,
              role: parsedUser.user.role,
            };
            setUser(userData);
            setUserId(parsedUser.user.id);
          }
        }
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
      }
    }
  }, [authData.user]);

  const handleTakeTest = (batteryId: string, batteryName: string) => {
    // Navigate to test attempt page with battery info
    router.push(`/take-test/attempt/${batteryId}?name=${encodeURIComponent(batteryName)}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalQuestions = (battery: any) => {
    return battery.batteryTests?.reduce((total: number, batteryTest: any) => {
      return total + (batteryTest.test?.questions?.length || 0);
    }, 0) || 0;
  };

  const getTotalDuration = (battery: any) => {
    return battery.batteryTests?.reduce((total: number, batteryTest: any) => {
      return total + (batteryTest.test?.duration || 0);
    }, 0) || 0;
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load available tests</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Take Test</h1>
            <p className="text-muted-foreground">
              Available assessments assigned to you
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading available tests...</p>
          </div>
        </div>
      )}

      {/* No Tests Available */}
      {!isLoading && accessibleBatteries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <TestTube className="h-16 w-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Tests Available</h3>
          <p className="text-sm">You don't have any assigned assessments at the moment.</p>
          <p className="text-xs mt-2 opacity-75">Contact your administrator if you expect to see tests here.</p>
        </div>
      )}

      {/* Batteries Grid */}
      {!isLoading && accessibleBatteries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleBatteries.map((battery) => {
            const totalQuestions = getTotalQuestions(battery);
            const totalDuration = getTotalDuration(battery);
            
            return (
              <Card
                key={battery.id}
                className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {battery.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={battery.isActive ? "default" : "secondary"}
                          className={battery.isActive ? "bg-green-600" : "bg-gray-400"}
                        >
                          {battery.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {battery.description && (
                    <CardDescription className="line-clamp-2">
                      {battery.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Test Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Tests:
                      </span>
                      <span className="font-medium">
                        {battery.batteryTests?.length || 0} batteries
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Questions:
                      </span>
                      <span className="font-medium">
                        {totalQuestions} total
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Duration:
                      </span>
                      <span className="font-medium">
                        {totalDuration} mins
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Assigned:
                      </span>
                      <span className="font-medium text-xs">
                        {formatDate(battery.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Test Details */}
                {battery.batteryTests && battery.batteryTests.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <p className="text-xs font-medium text-gray-600">Tests included:</p>
                      {battery.batteryTests.map((batteryTest: any, index: number) => (
                        <div key={batteryTest.id} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="font-medium">{batteryTest.test?.title}</div>
                          <div className="text-gray-500">
                            Weight: {batteryTest.weight}% | 
                            Duration: {batteryTest.test?.duration}ms | 
                            Questions: {batteryTest.test?.questions?.length || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="px-6 pt-3 border-t">
                  <Button
                    className="w-full"
                    onClick={() => handleTakeTest(battery.id, battery.name)}
                    disabled={!battery.isActive || totalQuestions === 0}
                    variant={battery.isActive && totalQuestions > 0 ? "default" : "secondary"}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {!battery.isActive 
                      ? "Inactive" 
                      : totalQuestions === 0 
                        ? "No Questions" 
                        : "Take Test"
                    }
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Test Statistics */}
      {!isLoading && accessibleBatteries.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {accessibleBatteries.length}
                </div>
                <div className="text-sm text-gray-600">Available Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {accessibleBatteries.filter(b => b.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {accessibleBatteries.reduce((total, battery) => 
                    total + getTotalQuestions(battery), 0
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
