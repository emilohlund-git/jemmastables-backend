import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Appointment } from "../entities/Appointment";

@InputType()
class AppointmentInput {
  @Field()
  from: string;
  @Field()
  to: string;
  @Field()
  date: string;
  @Field()
  booked: boolean;
  @Field()
  bookedBy: string;
  @Field()
  type: string;
}

@Resolver()
export class AppointmentResolver {
  @Query(() => [Appointment])
  appointments(): Promise<Appointment[] | undefined> {
    return Appointment.find();
  }

  @Query(() => Appointment, { nullable: true })
  appointment(@Arg("id") id: number): Promise<Appointment | undefined> {
    return Appointment.findOne(id);
  }

  @Mutation(() => Appointment)
  async createAppointment(
    @Arg("input") input: AppointmentInput
  ): Promise<Appointment> {
    return Appointment.create({ ...input }).save();
  }

  @Mutation(() => Boolean)
  async deleteAppointment(@Arg("id") id: number): Promise<Boolean> {
    await Appointment.delete(id);
    return true;
  }

  @Mutation(() => Appointment)
  async updateAppointment(
    @Arg("id") id: number,
    @Arg("booked") booked: boolean,
    @Arg("bookedBy") bookedBy: string
  ): Promise<Appointment | undefined> {
    const appointment = await Appointment.findOne(id);
    if (!appointment) {
      return undefined;
    }
    if (typeof booked !== "undefined") appointment.booked = booked;
    if (typeof bookedBy !== "undefined") appointment.bookedBy = bookedBy;
    Appointment.update({ id }, { booked, bookedBy });
    return appointment;
  }
}