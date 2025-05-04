import {
  Card,
  Box,
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

function getTimeBasedBgColor(datetime: number): string {
  const now = Date.now();
  const diffMin = (datetime - now) / (60 * 1000);

  if (!datetime || isNaN(datetime)) return "#ffffff";
  if (diffMin < 0) return "#ffffff";        // 지난 일정
  if (diffMin > 1440) return "#ffffff";     // 1일 이상 남은 일정
  if (diffMin > 720) return "#dbeafe";      // 12~24시간
  if (diffMin > 360) return "#bfdbfe";      // 6~12시간
  if (diffMin > 60) return "#93c5fd";       // 1~6시간
  return "#83b1fc";                         // 1시간 이하
}

export default function TaskList({ tasks, onDelete, onEdit }: Props) {
  return (
    <>
      {tasks.map((task) => {
        const bgColor = getTimeBasedBgColor(task.datetime);
        const isTextWhite = bgColor === "#83b1fc";

        return (
          <Card
            key={task.id}
            sx={{ mb: 2 }}
            style={{ backgroundColor: bgColor, color: isTextWhite ? "white" : "inherit" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6">{task.title}</Typography>                
                <Typography variant="caption" color="primary" sx={{ textAlign: "right", fontWeight: 600, fontSize: { xs: 14, sm: 14, md: 16, lg: 18 } }}  style={{ color: isTextWhite ? "white" : "inherit" }}>
                  #{task.tag}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" style={{ color: isTextWhite ? "white" : "inherit" }}>
                  {task.date}
                </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "left", fontSize: { xs: 16, sm: 16, md: 18, lg: 20 } }}
              >
                {task.description}
              </Typography>

            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button size="small" onClick={() => onEdit(task)}  style={{ color: isTextWhite ? "white" : "inherit" }}>
                수정
              </Button>
              <Button size="small" color="error" onClick={() => onDelete(task.id)}>
                삭제
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
}
