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
    date?: string | Date;
}

export type Workout = {
    id?: string,
    exercises: Exercise[];
    date?: string | Date;
    _id?: string; // For backward compatibility with MongoDB
}