import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(TasksRepository)
		private tasksRepository: TasksRepository,
	) {}
	getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		return this.tasksRepository.getTasks(filterDto, user);
	}

	async getTaskById(id: string, user: User): Promise<Task> {
		const found = await this.tasksRepository.findOne({
			where: { id, user },
		});
		if (!found) {
			throw new NotFoundException(`Task ${id} not found`);
		}

		return found;
	}

	createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		return this.tasksRepository.createTask(createTaskDto, user);
	}

	async deleteTask(id: string, user: User): Promise<{ message: string }> {
		const result = await this.tasksRepository.delete({ id, user });

		if (result.affected === 0) {
			throw new NotFoundException(`Task ${id} not found`);
		}
		return { message: 'Task deleted successfully' };
	}

	async updateTaskStatus(
		id: string,
		status: TaskStatus,
		user: User,
	): Promise<Task> {
		const task = await this.getTaskById(id, user);
		task.status = status;
		await this.tasksRepository.save(task);
		return task;
	}
}
