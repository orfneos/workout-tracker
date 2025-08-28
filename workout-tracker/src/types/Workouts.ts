export type WorkoutSet = {
    weight: number,
    reps: number
}

export type Exercise = {
    name: string,
    sets: WorkoutSet[];
}

export type CreateWorkout = {
    exercises: Exercise[];
    date?: Date;
}

export type Workout = {
    id: string,
    exercises: Exercise[];
    date?: Date;
    _id?: string; // For backward compatibility with MongoDB
}