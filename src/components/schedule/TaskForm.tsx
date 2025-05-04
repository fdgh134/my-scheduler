import { useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { Task } from "./ScheduleList";

interface Props {
  onAdd: (task: Omit<Task, "id">) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("업무");

  const tags = [
    { label: "업무", value: "업무" },
    { label: "회의", value: "회의" },
    { label: "개인", value: "개인" },
    { label: "기타", value: "기타" },
  ];

  const handleSubmit = () => {
    if (!title || !date || !time) return;

    const datetime = new Date(`${date}T${time}`).getTime();

    onAdd({ title, date: `${date} ${time}`, description, tag, datetime });
    
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setTag("업무");
  };

  const tagColorMap: Record<string, string> = {
    work: "#1976d2",      
    meeting: "#388e3c",   
    personal: "#f57c00",  
    other: "#9e9e9e",
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
        <TextField 
          select
          label="태그"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          sx={{ minWidth: "100px" , flexShrink: 0, backgroundColor: "white" }}     
        >
          {tags.map((option) => (
            <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              },
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tagColorMap[option.value] }} />
            {option.label}
          </MenuItem>
          ))}
        </TextField>
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
