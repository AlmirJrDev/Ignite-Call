import {  Button, Checkbox, Heading, MultiStep, Text, TextInput,  } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./style";
import { ArrowRight } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";

const timeIntervalsFormSchema = z.object({

})


export default function TimeIntervals() {
    const {
        register,
        handleSubmit,
        formState: {
            isSubmitting,
            errors,
        },
    } = useForm()
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

            <IntervalBox as="form">
                <IntervalsContainer>
                    <IntervalItem>
                        <IntervalDay>
                            <Checkbox />
                            <Text>Segunda-feira</Text>
                        </IntervalDay>
                        <IntervalInputs>
                            <TextInput
                                size="md"
                                type="time"
                                step={60}
                            />
                        </IntervalInputs>
                    </IntervalItem>
                    <IntervalItem>
                        <IntervalDay>
                            <Checkbox />
                            <Text>Terça-feira</Text>
                        </IntervalDay>
                        <IntervalInputs>
                            <TextInput
                                size="md"
                                type="time"
                                step={60}
                            />
                        </IntervalInputs>
                    </IntervalItem>
                </IntervalsContainer>
                <Button type="submit">
                    Próximo passo
                    <ArrowRight /> 
                </Button>
            </IntervalBox>
        </Container>
    )
}