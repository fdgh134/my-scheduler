import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { Task } from "./ScheduleList";

interface Props {
  onAdd: (task: Omit<Task, "id">) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = () => {
    if (!title || !date) return;
    onAdd({ title, date: `${date} ${time}`, description });
    setTitle("");
    setDate("");
    setDescription("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <TextField
          label="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white" }}
        />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
        <TextField
          type="date"
          label="날짜"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flexShrink: 0, backgroundColor: "white" }}
        />
        <TextField 
          label="시간"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flexShrink: 0, backgroundColor: "white" }}
        />
      </Box>
      <TextField
        type="상세 내용"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
        sx={{ backgroundColor: "white" }}
      />
      <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
        <Button variant="contained" onClick={handleSubmit} sx={{ minWidth: { xs: 120, sm: 100 }}}>
          추가
        </Button>
      </Box>
    </Box>
  );
}
