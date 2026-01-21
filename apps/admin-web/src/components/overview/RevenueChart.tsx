
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueData } from "@/lib/dummy-data";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const RevenueChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default RevenueChart;
