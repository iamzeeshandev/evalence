"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Users, Play, TestTube } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export function TestAttemptView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const batteryId = params?.id as string;
  const batteryName = searchParams?.get("name") || "Unknown Battery";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/take-test")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <TestTube className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Taking Test: {batteryName}
              </h1>
              <p className="text-muted-foreground">
                Complete your assessment below
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Test Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{batteryName}</CardTitle>
                {/* <CardDescription>
                  Battery ID: {batteryId}
                </CardDescription> */}
              </div>
              <Badge variant="default" className="bg-blue-600">
                In Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Time Limit</p>
                  <p className="text-sm text-gray-600">60 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Total Questions</p>
                  <p className="text-sm text-gray-600">25 questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Attempt Status</p>
                  <p className="text-sm text-gray-600">Ready to start</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
            <CardDescription>
              Read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">General Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate back and forth between questions</li>
                  <li>• Some questions may have multiple correct answers</li>
                  <li>• Unanswered questions will be marked as incomplete</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Technical Requirements:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Avoid refreshing the page during the test</li>
                  <li>• Close unnecessary tabs to improve performance</li>
                  <li>• Use recommended browsers (Chrome, Firefox, Safari)</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Your progress is saved automatically</li>
                  <li>• You can pause and resume the test if needed</li>
                  <li>• Contact support if you experience technical issues</li>
                  <li>• Double-check your answers before submitting</li>
                </ul>
              </div>
            </div>

            {/* <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    This is a dummy test attempt page
                  </p>
                  <p className="text-sm text-gray-600">
                    The actual test interface is still under development. This page shows how the test attempt 
                    interface will look when implemented.
                  </p>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push("/take-test")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          
          <div className="flex gap-3">
            {/* <Button variant="outline">
              Preview Questions
            </Button> */}
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                router.push(`/take-test/attempt/${batteryId}`);
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Test
            </Button>
          </div>
        </div>

        {/* Status Information
        <Card className="border-dashed">
          <CardContent className="py-6">
            <div className="text-center space-y-3">
              <TestTube className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 text-lg">Test Attempt Development Status</h3>
                <p className="text-gray-600 text-sm mt-1">
                  This page demonstrates the test attempt interface layout.
                  The actual test-taking functionality will be implemented in the next development phase.
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500">
                <p><strong>Features to be implemented:</strong></p>
                <ul className="space-y-1 text-left inline-block">
                  <li>• Interactive question interface</li>
                  <li>• Timer functionality</li>
                  <li>• Progressive saving</li>
                  <li>• Test submission</li>
                  <li>• Results display</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
