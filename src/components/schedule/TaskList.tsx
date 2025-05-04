import { useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Task } from "./ScheduleList";

interface Props {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  editTaskId: string | null;
  onUpdate: (task: Task) => void;
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

export default function TaskList({ tasks, onDelete, onEdit, editTaskId, onUpdate }: Props) {
  const [edited, setEdited] = useState<Partial<Task>>({});

  return (
    <>
      {tasks.map((task) => {
        const bgColor = getTimeBasedBgColor(task.datetime);
        const isTextWhite = bgColor === "#83b1fc";
        const isEditing = editTaskId === task.id;

        return (
          <Card
            key={task.id}
            sx={{ mb: 2 }}
            style={{ backgroundColor: bgColor, color: isTextWhite ? "white" : "inherit" }}
          >
            <CardContent>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="제목"
                    value={edited.title ?? task.title}
                    onChange={(e) => setEdited((prev) => ({ ...prev, title: e.target.value }))}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="날짜"
                    type="date"
                    value={
                      edited.date ??
                      (task.datetime ? new Date(task.datetime).toISOString().slice(0, 10) : task.date)
                    }
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = edited.datetime
                        ? new Date(edited.datetime).toTimeString().slice(0, 5)
                        : task.datetime
                          ? new Date(task.datetime).toTimeString().slice(0, 5)
                          : "00:00";
                      setEdited((prev) => ({
                        ...prev,
                        date,
                        datetime: new Date(`${date}T${time}`).getTime(),
                      }));
                    }}
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="시간"
                    type="time"
                    value={
                      edited.datetime !== undefined
                        ? new Date(edited.datetime).toTimeString().slice(0, 5)
                        : task.datetime
                          ? new Date(task.datetime).toTimeString().slice(0, 5)
                          : "00:00"
                    }
                    onChange={(e) => {
                      const time = e.target.value;
                      const date = edited.date ?? task.date ?? "";
                      if (!date) return; // 날짜가 없으면 처리 안 함
                      const datetime = new Date(`${date}T${time}`).getTime();
                      setEdited((prev) => ({ ...prev, datetime }));
                    }}
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="상세내용"
                    value={edited.description ?? task.description}
                    onChange={(e) => setEdited((prev) => ({ ...prev, description: e.target.value }))}
                    sx={{ mb: 1 }}
                    multiline
                  />
                  <TextField
                    fullWidth
                    select
                    label="태그"
                    value={edited.tag ?? task.tag}
                    onChange={(e) => setEdited((prev) => ({ ...prev, tag: e.target.value }))}
                    sx={{ mb: 1 }}
                  >
                    {["업무", "회의", "개인", "기타"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: { xs: 14, md: 16 },
                        color: isTextWhite ? "white" : "inherit",
                      }}
                    >
                      #{task.tag}
                    </Typography>
                  </Box>
                  <Typography variant="body2" style={{ color: isTextWhite ? "white" : "inherit" }}>
                    {new Date(task.datetime).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, textAlign: "left", fontSize: { xs: 16, sm: 18 } }}
                  >
                    {task.description}
                  </Typography>
                </>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {isEditing ? (
                <>
                  <Button
                    size="small"
                    onClick={() =>
                      onUpdate({
                        ...task,
                        ...edited,
                        title: edited.title ?? task.title,
                        description: edited.description ?? task.description,
                        tag: edited.tag ?? task.tag,
                        date: edited.date ?? task.date,
                        datetime: edited.datetime ?? task.datetime,
                      })
                    }
                  >
                    저장
                  </Button>
                  <Button size="small" color="error" onClick={() => onEdit({ ...task, id: "" })}>
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button size="small" onClick={() => onEdit(task)} style={{ color: isTextWhite ? "white" : "inherit" }}>
                    수정
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(task.id)}>
                    삭제
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        );
      })}
    </>
  );
}
