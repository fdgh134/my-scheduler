import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Task } from "./ScheduleList";

interface Props {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onDelete, onEdit }: Props) {
  return (
    <>
      {tasks.map((task) => (
        <Card key={task.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {task.date}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, textAlign: "left", fontSize: { xs: 16, sm: 16, md: 18, lg: 20 }}}>
              {task.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => onEdit(task)}>
              수정
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(task.id)}>
              삭제
            </Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
}
