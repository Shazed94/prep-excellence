"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute(
	"/dashboard/students-dashboard/my-profile/",
)({
	component: MyProfilePage,
});

function MyProfilePage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">My Profile</h1>
				<p className="text-muted-foreground">
					Manage your personal information
				</p>
			</div>

			{/* Profile Card */}
			<Card className="max-w-xl">
				<CardHeader className="flex flex-row items-center gap-4">
					<Avatar className="h-14 w-14">
						<AvatarFallback>SB</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>Shohag Bhuiyan</CardTitle>
						<p className="text-sm text-muted-foreground">
							Student • SAT Preparation
						</p>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">Email</p>
						<p className="font-medium">shohag@example.com</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">Target Score</p>
						<p className="font-medium">1500+</p>
					</div>

					<Button>Edit Profile</Button>
				</CardContent>
			</Card>
		</div>
	);
}
