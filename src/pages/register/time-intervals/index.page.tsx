import {  Button, Checkbox, Heading, MultiStep, Text, TextInput,  } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { FormError, IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./style";
import { ArrowRight } from "phosphor-react";
import { z } from "zod";
import { useFieldArray, useForm, Controller} from "react-hook-form";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from '../../../lib/axios'


const timeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
    }),
    ).length(7)
    .transform(intervals => intervals.filter(interval => interval.enabled))
    .refine(intervals => intervals.length > 0, {
        message: 'Você precisa selecionar pelo menos um dia da semana!'
    })
    .transform(interval => {
        return interval.map(interval => {
            return {
                weekDay: interval.weekDay,
                startTimeAndMinutes: convertTimeStringToMinutes(interval.startTime), 
                endTimeAndMinutes: convertTimeStringToMinutes(interval.endTime),
            }
        })
    })
    .refine(intervals => {
        return intervals.every(interval => interval.endTimeAndMinutes - 60 >= interval.startTimeAndMinutes)
    },{
        message: 'O horário de término deve ser pelo menos 1h distante do início.'
    }),
})
type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {isSubmitting, errors,},
    } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
              { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
              { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
              { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
              { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
              { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
              { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
              { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
            ],
          },
        })
    
    const weekDays = getWeekDays()

    const { fields } = useFieldArray({
        control,
        name: 'intervals',
      })
      const intervals = watch('intervals')  
      async function handleSetTimeIntervals(data: any) {
        const { intervals } = data as TimeIntervalsFormOutput
        await api.post('/users/time-intervals', {
            intervals,
        })
      }
  return (
        <Container>
            <Header>
                <Heading as='strong'>
                    Conecte sua agenda!
                </Heading>
                <Text>
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados. 
                </Text>
                
                <MultiStep size={4} currentStep={2}/>
            </Header>

            <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
                <IntervalsContainer>
                  {fields.map((field, index) => {
                    return (
                        <IntervalItem key={field.id}>
                        <IntervalDay>
                           <Controller
                           name={`intervals.${index}.enabled`}
                           control={control}
                           render={({ field }) => {
                            return (
                                <Checkbox 
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked === true)
                                  }}
                                  checked={field.value}
                                />
                                
                            )
                           }}
                           />
                            <Text>{weekDays[field.weekDay]}</Text>
                        </IntervalDay>
                        <IntervalInputs>
                            <TextInput
                                size="md"
                                type="time"
                                step={60}
                                disabled={intervals[index].enabled === false}
                                {...register(`intervals.${index}.startTime`)}
                            />
                            <TextInput
                                size="md"
                                type="time"
                                step={60}
                                disabled={intervals[index].enabled === false}
                                {...register(`intervals.${index}.endTime`)}
                            />
                        </IntervalInputs>
                    </IntervalItem>
                    )
                  })}
                 
                </IntervalsContainer>
                {errors.intervals && (
                    <FormError size='sm'>{errors.intervals.message}</FormError>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight /> 
                </Button>
            </IntervalBox>
        </Container>
    )
}