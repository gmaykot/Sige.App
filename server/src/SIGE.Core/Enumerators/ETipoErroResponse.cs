namespace SIGE.Core.Enumerators
{
    public enum ETipoErroResponse
    {
        // Códigos genéricos
        Success = 0,
        NotFound = 1,
        ValidationError = 2,
        Unauthorized = 3,

        // Código específico para exclusão com erro de cascata:
        // Indica que a operação de exclusão falhou porque existia uma restrição
        // de integridade referencial que impede o delete automático em cascata.
        // Por exemplo, o banco não permitiu apagar um registro porque existem
        // registros filhos que dependem dele e não foram removidos.
        DeleteCascadeError = 1001,

        // Erro de violação de restrição de chave estrangeira:
        // Ocorre quando uma operação tenta modificar ou excluir um registro que está
        // referenciado por outros registros relacionados (filhos), e o banco de dados
        // rejeita a operação para manter a integridade dos dados.
        ForeignKeyConstraintViolation = 1002,

        // Exclusão falhou devido a dependências relacionadas:
        // Indica que a exclusão não foi concluída porque existem dados relacionados
        // que bloqueiam a remoção, podendo ser dependências não configuradas para cascade
        // ou regras de negócio que impedem a exclusão.
        DeleteFailedDueToDependencies = 1003,
    }
}
