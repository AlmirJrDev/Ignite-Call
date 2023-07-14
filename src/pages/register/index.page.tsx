import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const  registerFormSchema = z.object({
    username: z.string()
    .min(3, { message: 'O usuario precisa ter pelo menos 3 letras.'})
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'o usuario pode ter apenas letras e hifens.'
    })
    .transform(username => username.toLowerCase()),
    name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 letras.'})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
    const {register, handleSubmit, formState: {errors, isSubmitted}} = useForm<RegisterFormData>({resolver: zodResolver(registerFormSchema)})

    async function handleRegister(data: RegisterFormData) { 
        console.log(data)
    }
    return(
        <Container>
            <Header>
                <Heading as='strong'>
                    Bem Vindo ao Call
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>
                
                <MultiStep size={4} currentStep={1}/>
            </Header>

            <Form as='form' onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size='sm'>Nome de usuário</Text>
                    <TextInput prefix="ignite.com/" placeholder="seu-usuario" {...register('username')}/>
                    {errors.username && (
                        <FormError size="sm">{errors.username.message}</FormError>
                    )}
                </label>

                <label>
                    <Text size='sm'>Nome de completo</Text>
                    <TextInput prefix="ignite.com/" placeholder="Seu nome"  {...register('name')}/>
                    {errors.name && (
                        <FormError size="sm">{errors.name.message}</FormError>
                    )}
                </label>

                <Button type="submit">
                    Próximo passo 
                    <ArrowRight />     
                </Button>
            </Form>
        </Container>
    )
}