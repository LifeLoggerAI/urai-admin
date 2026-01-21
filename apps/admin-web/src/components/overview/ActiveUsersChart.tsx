
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activeUsersData } from "@/lib/dummy-data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const ActiveUsersChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activeUsersData["7d"]}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default ActiveUsersChart;
