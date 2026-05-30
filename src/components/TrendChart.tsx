import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import styles from './TrendChart.module.css'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

function getLabels(count: number, type: 'week' | 'month') {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const result: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i)
    result.push(type === 'week' ? days[d.getDay()] : `${d.getMonth() + 1}/${d.getDate()}`)
  }
  return result
}

export default function TrendChart({ data, type }: { data: number[]; type: 'week' | 'month' }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (!instanceRef.current) instanceRef.current = echarts.init(chartRef.current)

    const minV = Math.min(...data, 0)
    const maxV = Math.max(...data, 0)
    const range = Math.max(maxV - minV, 4)
    const pad = range * 0.15

    instanceRef.current.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#E2E8F0',
        textStyle: { color: '#2D3748', fontSize: 13 },
      },
      grid: { top: 12, right: 16, bottom: 24, left: 16 },
      xAxis: {
        type: 'category', data: getLabels(data.length, type),
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#A0AEC0', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        min: Math.floor(minV - pad),
        max: Math.ceil(maxV + pad),
        splitLine: { lineStyle: { color: '#EDF2F7', type: 'dashed' } },
        axisLabel: { color: '#A0AEC0', fontSize: 10 },
      },
      series: [{
        type: 'line', data,
        smooth: true,
        lineStyle: { color: '#7EC8A3', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(126,200,163,0.2)' },
            { offset: 1, color: 'rgba(126,200,163,0.02)' },
          ]),
        },
        itemStyle: { color: '#7EC8A3' },
        symbol: 'circle', symbolSize: 6,
      }],
    })

    const h = () => instanceRef.current?.resize()
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [data, type])

  useEffect(() => () => { instanceRef.current?.dispose(); instanceRef.current = null }, [])

  return <div ref={chartRef} className={styles.chart} />
}
