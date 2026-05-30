import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import styles from './DonutChart.module.css'

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

interface DonutChartProps {
  positive: number
  neutral: number
  negative: number
}

export default function DonutChart({ positive, neutral, negative }: DonutChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current)
    }

    instanceRef.current.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#E2E8F0',
        textStyle: { color: '#2D3748', fontSize: 13 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#718096', fontSize: 12 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '78%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 3,
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' },
          },
          data: [
            { value: positive, name: '😊 滋养', itemStyle: { color: '#7EC8A3' } },
            { value: neutral, name: '😐 中性', itemStyle: { color: '#A0AEC0' } },
            { value: negative, name: '😔 消耗', itemStyle: { color: '#F4A0A0' } },
          ],
        },
      ],
    })

    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [positive, neutral, negative])

  useEffect(() => {
    return () => {
      instanceRef.current?.dispose()
      instanceRef.current = null
    }
  }, [])

  return <div ref={chartRef} className={styles.chart} />
}
