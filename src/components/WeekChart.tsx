import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import styles from './WeekChart.module.css'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

function getDayLabels() {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const result: string[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now); day.setDate(day.getDate() - i)
    result.push(days[day.getDay()])
  }
  return result
}

export default function WeekChart({ data }: { data: number[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, undefined, { width: chartRef.current.clientWidth, height: 160 })
    }

    const minVal = Math.min(...data, -1)
    const maxVal = Math.max(...data, 1)

    instanceRef.current.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#E2E8F0',
        textStyle: { color: '#2D3748', fontSize: 13 },
        formatter: (params: { name: string; value: number }[]) => {
          const v = params[0].value
          return `${params[0].name}<br/>净能量：${v > 0 ? '+' : ''}${v}`
        },
      },
      grid: { top: 8, right: 8, bottom: 24, left: 8 },
      xAxis: {
        type: 'category',
        data: getDayLabels(),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#A0AEC0', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        min: Math.floor(minVal),
        max: Math.ceil(maxVal),
        splitLine: { lineStyle: { color: '#EDF2F7', type: 'dashed' } },
        axisLabel: { color: '#A0AEC0', fontSize: 10 },
      },
      series: [{
        type: 'bar',
        data: data.map((v) => ({ value: v, itemStyle: { color: v >= 0 ? '#7EC8A3' : '#F4A0A0', borderRadius: [4, 4, 0, 0] } })),
        barWidth: 20,
        barGap: '30%',
      }],
    })

    const h = () => instanceRef.current?.resize()
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [data])

  useEffect(() => () => { instanceRef.current?.dispose(); instanceRef.current = null }, [])

  return <div ref={chartRef} className={styles.chart} />
}
