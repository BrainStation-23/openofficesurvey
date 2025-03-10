
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LivePieChartData } from './types';

interface LivePieChartProps {
  data: LivePieChartData[];
  total: number;
}

export function LivePieChart({ data, total }: LivePieChartProps) {
  const [animatedData, setAnimatedData] = useState(data);

  useEffect(() => {
    setAnimatedData(data);
  }, [data]);

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="w-full h-[400px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={animatedData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="count"
            animationDuration={300}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="middle"
                  className="fill-current text-sm"
                >
                  {value} ({(percent * 100).toFixed(1)}%)
                </text>
              );
            }}
          >
            {animatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current font-medium"
          >
            <tspan x="50%" dy="-1em" className="text-2xl">
              {total}
            </tspan>
            <tspan x="50%" dy="1.5em" className="text-sm text-muted-foreground">
              Total Responses
            </tspan>
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
