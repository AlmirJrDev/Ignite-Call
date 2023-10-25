import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa no mínimo 3  caractéres"}),
  email: z.string().email({ message: "Digite um email válido"}), 
  observations: z.string().nullable(),

})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export function ConfirmStep() {
  const { register, handleSubmit, formState: { isSubmitting, errors}} = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema)
  })


  function handleConfirmScheduling(data: ConfirmFormData) {
    console.log(data) 
  }
  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
        <CalendarBlank/>
          10 de outubro de 2023
        </Text>
        <Text>
          <Clock/>
          09:00h
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu Nome"  {...register('name')}/>
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>
      
      <label>
        <Text size="sm">Endereço do seu e-mail</Text>
        <TextInput type="email" placeholder="johndoe@example.com" {...register('email')}/>
        {errors.email && <FormError size="sm">{errors.email.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço do seu e-mail</Text>
        <TextArea {...register('observations')}/> 
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  )
}